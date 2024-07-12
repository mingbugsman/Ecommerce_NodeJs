'use strict'

//tuong tu lv0

const mongoose = require('mongoose');

const connectString = "mongodb://localhost:27017/shopDev";

mongoose.connect(connectString)
        .then(_ => {
            console.log("successfully connected mongodb");
            
        })
        .catch(err => console.log(`error connect`));

if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', {color : true});
}

module.exports = mongoose;




// nhuoc diem 
/*
    nhiều kết nối xảy ra nếu có tư tưởng thế này thì sử dụng các công nghệ spring boot hoặc laravel
    sẽ bị vấn đề này
*/