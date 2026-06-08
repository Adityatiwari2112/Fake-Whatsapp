const mongoose = require('mongoose');
const Chat=require("./models/chat.js");
main()
.then(()=>{
    console.log("connected sucessfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

}
let Allchats=([
    {
        from:"adi",
        to:"shi",
        msg:"hello",
        Date:new Date()
    },
    {
        from:"aditya",
        to:"shipra",
        msg:"hello ji",
        Date:new Date()
    },
    {
        from:"harsh",
        to:"payal",
        msg:"bye",
        Date:new Date()
    },
    {
        from:"tiwari",
        to:"tiwari",
        msg:"hello tiwari",
        Date:new Date()
    },

]);
Chat.insertMany(Allchats);
