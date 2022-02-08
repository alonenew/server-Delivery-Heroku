const Address = require('../models/address');


module.exports = {

    async findByUser(req, res, next) {

        try {
            const id_user = req.params.id_user;
            const data = await Address.findByUser(id_user);
            console.log(`Address ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'เกิดข้อผิดพลาดขณะพยายามขอเส้นทาง',
                error: error,
                success: false
            })
        }

    },

    async create(req, res, next) {
        try {
            
            const address = req.body;
            const data = await Address.create(address);

            return res.status(201).json({
                success: true,
                message: 'เพิ่มที่อยู่สำเร็จ',
                data: data.id
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