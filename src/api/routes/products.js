const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product'); 
//const { counter } = require('@fortawesome/fontawesome-svg-core');
//const product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select("name price _id")
    .exec()
    .then(doc => {
     const response = {
        count: doc.length,
        products: doc.map(doc =>{
            return {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + doc.id
                }
            }
        })
     };
     res.status(200).json(response);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    

});
router.post('/', (req, res, next) => {
    const product = new Product ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({

            message: 'ürün oluşturuldu',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" +result.id
                }
            }

    
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
   
});

router.get('/:productID', (req, res, next) => {
   const id = req.params.productID;
   Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("from database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/"
                    }
                });
            } else {
                res.status(404).json({ message: 'Böyle bir ürün mevcut değil' });
            }
        })

   .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
   });

});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Geçersiz ID formatı" });
    }

    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ 
                    message: "Ürün başarıyla silindi",
                    request: {
                        type: 'POST',
                        url: "http://localhost:3000/products/" + id
                    }
                 })

            } else {
                res.status(404).json({ message: "Ürün bulunamadı" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;

    // Geçersiz ObjectID kontrolü
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Geçersiz ID formatı" });
    }

    // Güncellenecek alanlar
    const updateOps = {};

    // Body'den gelen key-value çiftlerini updateOps objesine ekliyoruz
    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Ürün bulunamadı" });
            }
            res.status(200).json({
                message: "Ürün güncellendi",
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" ,
                    body: { name: 'String', price: 'Number'}
                }
                
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.put('/:productID', (req, res, next) => {
    const id = req.params.productID;

    // Geçersiz ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Geçersiz ID formatı" });
    }

    // Gelen veriden yeni ürün bilgileri alınır
    const updatedProduct = {
        name: req.body.name,
        price: req.body.price
    };

    // Eksik alan kontrolü (opsiyonel ama önerilir)
    if (!updatedProduct.name || !updatedProduct.price) {
        return res.status(400).json({ message: "Lütfen name ve price alanlarını sağlayın" });
    }

    Product.replaceOne({ _id: id }, updatedProduct)
        .exec()
        .then(result => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Ürün bulunamadı" });
            }
            res.status(200).json({
                message: "Ürün tamamen güncellendi",
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;