var mysql = require("mysql");
const express = require("express");
const app = express();
app.set('view engine','ejs')
const bodyParser = require("body-parser");
var con  = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "123456",
    database : "blog"
  });
  con.connect(function(err){
      if(err) throw err;
      console.log("Database Connected");
});
app.use(bodyParser.urlencoded({
    extended:true
}));
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});
app.post("/register",function(req,res){
    var sql="Insert into profile values ('"+req.body.phone+"','"+req.body.password+"','"+req.body.name+"')";
    con.query(sql,function(err,result){
        if(err) throw err;
        else{
            sql2="create table blog"+req.body.phone+" (blogId int NOT NULL AUTO_INCREMENT,blogHeading varchar(1000),blogContent varchar(7000),PRIMARY KEY (blogId))";
            sql3="create table comments"+req.body.phone+" (comments varchar(2000))";
            sql4="ALTER TABLE blog"+req.body.phone+" AUTO_INCREMENT=1";
            con.query(sql2 , function(err,result){
                if(err) throw err;
            });
            con.query(sql4 , function(err,result){
                if(err) throw err;
            })
            con.query(sql3,function(err,result){
                if(err) throw err;
            });
        };
    });
});

app.post("/login",function(req,res){
    var blogHeading=[];
    var blogContent=[];
    var blogId=[];
    var phone = String(req.body.phone);
    var password = String(req.body.password);


    var sql = "select password from profile where phone='"+phone+"'";
    con.query(sql,function(err,result){
        if(err) throw err;
        var pass = result[0].password;
        if(pass==password){
            var sql2 = "select * from blog"+phone+"";
            con.query(sql2,function(err,result){
                if(err) throw err;
                var  blogs  = result;

            var sql3 = "select * from comments"+phone+"";
            con.query(sql3,function(err,result1){
                if(err) throw err;
                var comments = result1;
                for(var i=0;i<blogs.length;i++){
                    blogHeading.push(blogs[i].blogHeading);
                    blogContent.push(blogs[i].blogContent);
                    blogId.push(blogs[i].blogId);
                }
                res.render("globalPage",{
                    blogHeading:blogHeading,
                    blogContent:blogContent,
                    phone:phone,
                    blogId:blogId
                });

              });
           });
        };
    });
});

app.post("/blogToDb",function(req,res){
  var heading = String(req.body.Head);
  var Content = String(req.body.Body);
  var number = String(req.body.number);
  var blogIdd = 0;
  var sql="insert into blog"+number+"(blogHeading , BlogContent) values('"+heading+"','"+Content+"')";
  con.query(sql,function(err,result){
      if(err) throw err;
  });
  var sql1= "select blogId from blog"+number+" where blogHeading = '"+heading+"'";
  con.query(sql1,function(err,result1){
      if(err) throw err;
      blogIdd=result1[0].blogId;
      console.log(blogIdd)

  var sql2 = "ALTER TABLE comments"+number+" ADD [COLUMN] CommentsNames"+blogIdd+" Varchar(250);"
      con.query(sql2,function(err,result){
          if(err) throw err;

  var sql3 = "ALTER TABLE comments"+number+" ADD [COLUMN] Comments"+blogIdd+" Varchar(250);"
      con.query(sql3,function(err,result){
          if(err) throw err;
  });
  });
  });
  });

app.post("/openBlog",function(req,res){
    var blogId = String(req.body.blogId);
    var phone =  String(req.body.phone);
    sql="select blogHeading , blogContent from blog"+req.body.phone+" where blogId="+req.body.blogId+"";
    con.query(sql,function(err,result){
        if(err) throw err;
        var blogHeading = result[0].blogHeading;
        var blogContent = result[0].blogContent;
        sql1=select 
        res.render("blogPage",{blogHeading:blogHeading,blogContent:blogContent,phone:phone,blogId:blogId});
    });
});

app.post("/myBlogs",function(req,res){
    phone = String(req.body.phone);
    sql = "select * from blog"+phone+"";
    con.query(sql , function(err,result){
        var blogId=[]; var blogHeading =[];var blogContent=[];
        for(var i=0;i<result.length;i++){
            blogId.push(result[i].blogId);
            blogHeading.push(result[i].blogHeading);
            blogContent.push(result[i].blogContent);
        }
      res.render("myBlogs",{
          blogId:blogId,
          blogContent:blogContent,
          blogHeading:blogHeading,
          phone:phone
    });  
    });
});

app.post("/deleteBlog",function(req,res){
   var phone  = String(req.body.phone);
   var blogId = String(req.body.blogId);
   console.log(phone);
   console.log(blogId);
   sql="delete from blog"+phone+" where blogId= "+blogId+""
   con.query(sql,function(err,result){
       if(err) throw err;
   });

});




app.listen(3000,function(err){
    if(err) throw err;
    console.log("server running on port 3000");
})