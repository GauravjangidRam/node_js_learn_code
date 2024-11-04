const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
// disk store

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    crypto.randomBytes(12,function(err,data){
        if (err) return cb(err)
      const fn = data.toString('hex') + path.extname(file.originalname);
    cb(null,fn)

    });
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;