const Category = require('../models/category');

module.exports = {

    async getAll(req, res, next) {

        try {
            const data = await Category.getAll();
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาดขณะพยายามรับหมวดสินค้า',
                error: error,
                success: false
            })
        }

    },

    async create(req, res, next) {
        try {
            const category = req.body;
            const data = await Category.create(category);

            return res.status(201).json({
                message: 'สร้างหมวดสินค้าแล้ว',
                success: true,
                data: data.id
            });

        } 
        catch (error) {  
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาดในการสร้างหมวดสินค้า',
                success: false,
                error: error
            });
        }
    }

}