const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

// sadece kullanıcıya ait olan siparişleri getirir
exports.orders_get_all = (req, res, next) => {
  Order.find({ user: req.userData.userId })
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + doc._id
          }
        }))
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//sipariş oluşturma
exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
        user: req.userData.userId
      });
      return order.save();
    })
    .then(result => {
      if (!result) return; // 404 sonrası zinciri kır
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log("sipariş oluşturulamadı:", err);
      res.status(500).json({
        error: { message: err.message, stack: err.stack }
      });
    });
};

// Tek siparişi getir (kullanıcıya aitse)
exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({ message: "sipariş bulunamadı" });
      }
      if (order.user.toString() !== req.userData.userId) {
        return res.status(403).json({ message: "Bu sipariş size ait değil" });
      }
      res.status(200).json({
        order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// Siparişi güncelleme (kendi siparişiyse)
exports.orders_update_order = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "sipariş bulunamadı" });
    }

    if (order.user.toString() !== req.userData.userId) {
      return res.status(403).json({ message: "Bu sipariş size ait değil!" });
    }

    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    await Order.updateOne({ _id: orderId }, { $set: updateOps });

    res.status(200).json({
      message: "sipariş güncellendi",
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + orderId
      }
    });
  } catch (err) {
    console.log("sipariş güncellenemedi:", err);
    res.status(500).json({ error: err });
  }
};

// kendi siparişiyse siparişi siler 
exports.orders_delete_order = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "sipariş bulunamadı" });
    }

    if (order.user.toString() !== req.userData.userId) {
      return res.status(403).json({ message: "Bu sipariş size ait değil!" });
    }

    await Order.deleteOne({ _id: req.params.orderId });

    res.status(200).json({
      message: "sipariş silindi",
      request: {
        type: "POST",
        url: "http://localhost:3000/orders",
        body: { productId: "ID", quantity: "Number" }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
