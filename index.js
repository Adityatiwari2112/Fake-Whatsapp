const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const Chat=require("./models/chat.js");
const methodoverride=require("method-override");
const ExpressError=require("./ExpressError");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));

main()
.then(()=>{
    console.log("connected sucessfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

}

app.get("/",(req,res,next)=>{
    res.send("root is working");
});
//index route
app.get("/chats",asyncWrap( async(req,res)=>{
   
    let chats=await Chat.find();
    // console.log(chats);
    res.render("index.ejs",{chats});

   
   
}));
//new route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");

})
//create route 
// Validation based error use try catch

    app.post("/chats",asyncWrap(async (req,res,next)=>{
    
        let{from,to,msg}=req.body;
        let newChat=new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date(),
       });
       await newChat.save()
   
      res.redirect("/chats");
   
   }));



app.get("/chats/:id/edit",asyncWrap( async(req,res,next)=>{
    
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat});
   
   
}));

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
    }
};

//show route
app.get("/chats/:id",asyncWrap( async (req,res,next)=>{
    
    let {id}=req.params;
    let chat= await Chat.findById(id);
    if(!chat){
        next(new ExpressError(404,"chat not found"));
    }
    res.render("edit.ejs",{chat});   
    
}));

//update route
app.put("/chats/:id",asyncWrap( async(req,res,next)=>{
   
     let {id}=req.params;
     let {msg:newMsg}=req.body;
     let updatedChat = await Chat.findByIdAndUpdate(id,
        { msg : newMsg},
        {runValidators:true,new:true}
    );
    console.log(updatedChat);
    res.redirect("/chats");

    
     

}));
//Destroy route

app.delete("/chats/:id",asyncWrap( async(req,res)=>{
   
    let {id}=req.params;
    let deletedchat=await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
    console.log(deletedchat);

    
    
}));
//Mongoose error handler
const handleValidation = (err)=>{
    console.log("This is a validation error,Please follow the rules");
    console.dir(err);
    return err;
};
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
      err =  handleValidation(err);
    }
    next(err);
});
//error handling middleware
app.use((err,req,res,next)=>{
    let{status=500,message="Some error occured"}=err;
    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("Listning at port 8080");
});