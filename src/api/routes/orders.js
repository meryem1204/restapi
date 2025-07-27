const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

// Tüm siparişleri getir
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length, // ✅ düzeltildi
                orders: doc.map(d => {
                    return {
                        _id: d._id,
                        product: d.product,
                        quantity: d.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + d._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Yeni sipariş oluştur
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Ürün geçerli değil'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity, // ✅ düzeltildi
                product: new mongoose.Types.ObjectId(req.body.productId) // ✅ düzeltildi
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Sipariş oluşturuldu',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Belirli bir siparişi getir
router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID) // ✅ body yerine params kullanılmalı
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Sipariş bulunamadı'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + order._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Siparişi sil
router.delete('/:orderID', (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderID }) // `.remove()` yerine `.deleteOne()` önerilir
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Sipariş silindi',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    body: {
                        productId: 'ID',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Güncelleme endpointi (şu an sadece mesaj veriyor)
router.put('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Sipariş güncellendi'
    });
});

module.exports = router;
