const express = require("express");
const app = express();
const https= require("https");
const request = require("request");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public")); //To make a static folder and put css and images files in it to easy access on server.

app.get("/",function(req,res){
res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
const fname = req.body.firstName;
const lname = req.body.lastName;
const email = req.body.Email;
//Now we have to send all the data to mailchimp server and we will bind it inside const data and then convert it into json forat using stringify method
const data = {
  members : [       // In array format
    {
      email_address:email,
      status: "subscribed",
      merge_fields:{
        FNAME:fname,    //FNAME LNAME is names of text boxes inside mailchimp
        LNAME:lname     //email_address,status,merge_fields are the default fields inside mailchimp.
      }
    }
  ]
};

const jsonData = JSON.stringify(data);    //conversion into json for sending
const url ="https://us17.api.mailchimp.com/3.0/lists/735cb499cb"; //last url contains list id

const options = {
  method : "POST",
  auth : "Kashif:e9166227fc679d8f13ba933ac6aced5d-us17"
}

const request = https.request(url,options,function (response){

response.on("data",function(data){
if(response.statusCode === 200)
{
  res.sendFile(__dirname + "/success.html");
}
else
{
  res.sendFile(__dirname + "/failure.html");
}


console.log(JSON.parse(data));
})

})
request.write(jsonData);  //Using request.write() we are sending the data on mailchimp server in a const variable called jsonData
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(req,res){  //it will run on heroku server as well as localhost 3000 ,both for checking post
  //process.env.PORT is port given by heroku server to deploy.
  console.log("Server is running on port 3000");
});

// API key
// e9166227fc679d8f13ba933ac6aced5d-us17    //Put the last no 17 into url after us

// List id
// 735cb499cb
