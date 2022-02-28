const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env')
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();


const storage = new Storage({
    projectId: "ardearbakeryapp",
    keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://ardearbakeryapp.appspot.com/");

/**
 * Subir el archivo a Firebase Storage
 * @param {File} file objeto que sera almacenado en Firebase Storage
 */
module.exports = (file, pathImage, deletePathImage) => {
    return new Promise((resolve, reject) => {
        
        console.log('delete path', deletePathImage)
        if (deletePathImage) {

            if (deletePathImage != null || deletePathImage != undefined) {
                const parseDeletePathImage = url.parse(deletePathImage)
                var ulrDelete = parseDeletePathImage.pathname.slice(23);
                const fileDelete = bucket.file(`${ulrDelete}`)

                fileDelete.delete().then((imageDelete) => {

                    console.log('ลบภาพสำเร็จ')
                }).catch(err => {
                    console.log('ลบรูปภาพไม่สำเร็จ ผิดพลาด :', err)
                });

            }
        }


        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {

                let fileUpload = bucket.file(`${pathImage}`);
                let stream = fileUpload.createWriteStream();
                const blobStream = stream.pipe(fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                }));

                blobStream.on('error', (error) => {
                    reject('บางสิ่งบางอย่างที่ไม่ถูกต้อง! ไม่สามารถอัปโหลดได้ในขณะนี้.');
                });

                blobStream.on('finish', () => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    resolve(url);
                });

                blobStream.end(file.buffer);
            }
        }
    });
}