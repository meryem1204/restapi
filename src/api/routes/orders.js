const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'istek alındı'

    });
});
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'sipariş oluşturuldu',
        order: order

    });
});

router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    if (id == 'special'){res.status(200).json({
        message: 'order details',
        orderId: req.params.orderID
 
    });
 } else {
    res.status(200).json({
        message: ' girdiğin id',
        orderID: id
    });
 }

});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'sipariş delete edildi'

    });
});

router.put('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'sipariş  update edildi'

    });
});
module.exports = router;