var express     = require("express"),
methodOverride  = require("method-override"),
expressSanitizer=require("express-sanitizer"),
bodyParser      =require("body-parser"),
mongoose        =require("mongoose"),
reload          =require("reload"),
app             =express();

// mongoose.connect("mongodb://localhost:27017/restful_blog_app_1");
mongoose.connect("mongodb://localhost/restful_blog_app_1", {useUnifiedTopology: true,useNewUrlParser: true,}).then(() => console.log('DB Connected!')).catch(err => {
console.log("DB Connection Error: ");
});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image:String,
    body:String,
    created: {type:Date,default:Date.now},
    email: String,
    password:String
});



var Blog=mongoose.model("Blog",blogSchema);



app.get("/",function(req,res){
    res.render("signup");
    
})
app.post("/login",function(req,res){
    var email=req.body.blog.email;
    var pass=req.body.blog.password;

    Blog.find({email:email,password:pass},function(err,blogs){
        
        if(blogs[0]==null || blogs[0].email!=email || blogs[0].email==" "){
            res.redirect("/");
            
        }
        else{
            res.redirect("/blogs");
        }
    })
})


app.get("/sign",function(req,res){
    res.render("sign");
})

app.post("/signin",function(req,res){
    Blog.create(req.body.blog,function(err,infoBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })

})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if (err){
            console.log("ERROR!");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    })
    
})

//NEW
app.get("/blogs/new",function(req,res){
    res.render("new");
})
//RESTFUL ROUTES
app.post("/blogs",function(req,res){
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs")
        }
    }) 
})

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            
             res.render("show",{blog:foundBlog});
        }
    })
    
})

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    })
    
})

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//DELETE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndDelete(req.params.id,function(err,delBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})
app.listen(3000,function(){
    console.log("Server is running");
})