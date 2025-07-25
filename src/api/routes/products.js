const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



const Product = require('../models/product '); 

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get isteğiyle product istekleri alır'

    });
});
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({

        message: 'post ile product istekleri alır',
        createdProduct: product

    });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    if (id == 'special'){res.status(200).json({
        message: 'special id',
        id: id
 
    });
 } else {
    res.status(200).json({
        message: ' girdiğin  id'
    });
 }

});

router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'delete edildi'

    });
});

router.put('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'update edildi'

    });
});
module.exports = router;