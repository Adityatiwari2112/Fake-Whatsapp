const mongoose = require('mongoose');
const chatschema=new mongoose.Schema({
    from:{
        type:String,
        required:true,
    },
    to:{
        type:String,
        required:true,
    },
    msg:{
        type:String,
        maxLength:30
    },
    created_at:{
        type:Date,
        required:true,
    }
    
})
const Chat=new mongoose.model("Chat",chatschema);
module.exports=Chat;