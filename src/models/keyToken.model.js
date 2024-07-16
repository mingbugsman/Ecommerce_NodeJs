const {model,Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME ='Key';
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var KeyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required : true,
        ref : 'Shop'
    },
    publicKey:{
        type:String,
        required:true
    },
    privateKey : {
        type : String,
        required : true
    },
    refreshToken:{
        type:Array,default : []
    }
}, {
    timestamps : true,
    collection : COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, KeyTokenSchema);