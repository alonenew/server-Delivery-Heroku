const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    async getAll(req, res, next) {
        try {
            const data = await User.getAll();    
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการแสดงข้อมูล'
            });
        }
    },

    async findById(req, res, next) {
        try {
            const id = req.params.id;

            const data = await User.findByUserId(id);    
            console.log(`Usuario: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการแสดงข้อมูลด้วย ID'
            });
        }
    },
    
    async findDeliveryMen(req, res, next) {
        try {
            const data = await User.findDeliveryMen();    
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'ส่งของไม่สำเร็จ'
            });
        }
    },
    
    async getAdminsNotificationTokens(req, res, next) {
        try {
            const data = await User.getAdminsNotificationTokens();    
            let tokens = [];


            data.forEach(d => {
                tokens.push(d.notification_token);
            });

            return res.status(201).json(tokens);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'ส่งของไม่สำเร็จ'
            });
        }
    },

    async register(req, res, next) {
        try {
            
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1); // ROL POR DEFECTO (CLIENTE)

            return res.status(201).json({
                success: true,
                message: 'ลงทะเบียนเรียบร้อยแล้วกำลังเข้าสู่ระบบ',
                data: data.id
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'มีข้อผิดพลาดในการลงทะเบียน',
                error: error
            });
        }
    },

    async registerWithImage(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            const data = await User.create(user);

            await Rol.create(data.id, 1); // ROL POR DEFECTO (CLIENTE)

            return res.status(201).json({
                success: true,
                message: 'ลงทะเบียนเรียบร้อยแล้วกำลังเข้าสู่ระบบ',
                data: data.id
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'มีข้อผิดพลาดในการลงทะเบียน',
                error: error
            });
        }
    },

    async update(req, res, next) {
        try {
            
            const user = JSON.parse(req.body.user);

            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'อัปเดตข้อมูลเรียบร้อยแล้ว'
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
                error: error
            });
        }
    },
    
    async updateNotificationToken(req, res, next) {
        try {
            
            const body = req.body;

            await User.updateNotificationToken(body.id, body.notification_token);

            return res.status(201).json({
                success: true,
                message: 'จัดเก็บเรียบร้อยแล้ว'
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la actualizacion de datos del usuario',
                error: error
            });
        }
    },

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'ไม่พบรหัสผู้ใช้'
                });
            }

            if (User.isPasswordMatched(password, myUser.password)) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {
                    // expiresIn: (60*60*24) // 1 HORA
                    // expiresIn: (60 * 3) // 2 MINUTO
                });
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }
                
                await User.updateToken(myUser.id, `JWT ${token}`);


                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'เข้าสู่ระบบสำเร็จ'
                });
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'รหัสผ่านผิดพลาด'
                });
            }

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาด',
                error: error
            });
        }
    },
    async logout(req, res, next) {

        try {
            const id = req.body.id;
            await User.updateToken(id, null);
            return res.status(201).json({
                success: true,
                message: 'ออกจากระบบสำเร็จ'
            });
        } 
        catch(e) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'เกิดข้อผิดพลาด',
                error: error
            });
        }
    }



};