const Order = require('../models/order');
const OrderHasProduct = require('../models/order_has_products');


module.exports = {


    async findByStatus(req, res, next) {

        try {
            const status = req.params.status;
            const data = await Order.findByStatus(status);
            console.log(`Status ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาดขณะพยายามรับคำสั่งซื้อ',
                error: error,
                success: false
            })
        }

    },
    
    async findByDeliveryAndStatus(req, res, next) {

        try {
            const id_delivery = req.params.id_delivery;
            const status = req.params.status;

            const data = await Order.findByDeliveryAndStatus(id_delivery, status);
            return res.status(201).json(data);
        } 
        catch (error) {
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาดขณะพยายามรับคำสั่งซื้อ',
                error: error,
                success: false
            })
        }

    },

    async findByClientAndStatus(req, res, next) {

        try {
            const id_client = req.params.id_client;
            const status = req.params.status;

            const data = await Order.findByClientAndStatus(id_client, status);
            return res.status(201).json(data);
        } 
        catch (error) {
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาดขณะพยายามรับคำสั่งซื้อ',
                error: error,
                success: false
            })
        }

    },

    async create(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'รายการสั่งซื้อ';
            const data = await Order.create(order);
            
            for (const product of order.products) {
                await OrderHasProduct.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success: true,
                message: 'คำสั่งซื้อสำเร็จแล้ว',
                data: data.id
            });

        } 
        catch (error) {
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการสั่งซื้อ',
                error: error
            });
        }
    },

    async updateToDispatched(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'กำลังทำอาหาร';
            await Order.update(order);
            

            return res.status(201).json({
                success: true,
                message: 'อัปเดตคำสั่งซื้อเรียบร้อยแล้ว',
            });

        } 
        catch (error) {
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการสั่งซื้อ',
                error: error
            });
        }
    },

    async updateToOnTheWay(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'ดำเนินการส่ง';
            await Order.update(order);
            

            return res.status(201).json({
                success: true,
                message: 'อัปเดตคำสั่งซื้อเรียบร้อยแล้ว',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการสั่งซื้อ',
                error: error
            });
        }
    },

    async updateToDelivered(req, res, next) {
        try {
            
            let order = req.body;
            order.status = 'ส่งแล้ว';
            await Order.update(order);
            

            return res.status(201).json({
                success: true,
                message: 'อัปเดตคำสั่งซื้อเรียบร้อยแล้ว',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดการอัปเดตคำสั่งซื้อ',
                error: error
            });
        }
    },

    async updateLatLng(req, res, next) {
        try {
            
            let order = req.body;
            await Order.updateLatLng(order);
            
            return res.status(201).json({
                success: true,
                message: 'อัปเดตคำสั่งซื้อเรียบร้อยแล้ว',
            });

        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาด',
                error: error
            });
        }
    }

}