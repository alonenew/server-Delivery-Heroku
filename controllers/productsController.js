const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {

    async findByCategory(req, res, next) {
        try {
            const id_category = req.params.id_category; 
            const data = await Product.findByCategory(id_category);
            return res.status(201).json(data);
        } 
        catch (error) {
            return res.status(501).json({
                message: `เกิดข้อผิดพลาด`,
                success: false,
                error: error
            });
        }
    },
    
    async findByCategoryAndProductName(req, res, next) {
        try {
            const id_category = req.params.id_category; 
            const product_name = req.params.product_name; 
            const data = await Product.findByCategoryAndProductName(id_category, product_name);
            return res.status(201).json(data);
        } 
        catch (error) {
            return res.status(501).json({
                message: `เกิดข้อผิดพลาด`,
                success: false,
                error: error
            });
        }
    },

    async create(req, res, next) {

        let product = JSON.parse(req.body.product);

        const files = req.files;

        let inserts = 0;
        
        if (files.length === 0) {
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาด',
                success: false
            });
        }
        else {
            try {
                
                const data = await Product.create(product); // ALMACENANDO LA INFORMACION
                product.id = data.id;

                const start = async () => {
                     await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);

                        if (url !== undefined && url !== null) {
                            if (inserts == 0) { // IMAGEN 1
                                product.image1 = url;
                            }
                            else if(inserts == 1) { // IMAGEN 2
                                product.image2 = url;
                            }
                            else if(inserts == 2) { // IMAGEN 3
                                product.image3 = url;
                            }
                        }

                        await Product.update(product);
                        inserts = inserts + 1;

                        if (inserts == files.length) {
                            return res.status(201).json({
                                success: true,
                                message: 'เพิ่มรายการสินค้าเรียบร้อยแล้ว'
                            });
                        }

                     }); 

                }

                start();

            } 
            catch (error) {
                return res.status(501).json({
                    message: `เกิดข้อผิดพลาดในการเพิ่มสินค้า ${error}`,
                    success: false,
                    error: error
                });
            }
        }

    }

}