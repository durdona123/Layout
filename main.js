const getJSONString = function (obj) { return JSON.stringify(obj, null, 2); }
var express = require('express');
var app = express();
const layouts = require("express-ejs-layouts");
app.use(layouts);
const bcrypt = require("bcryptjs");//ADDED
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var mongoose = require("mongoose");//addedd///
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/cis485",
);
mongoose.pluralize(null);//prevent addidng an 's' to the table name
var loginSchema = new mongoose.Schema({
    userid: String,
    password: String
});
var catalogSchema = new mongoose.Schema({
    code: String,
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String
});

var User = mongoose.model("login", loginSchema);
var Catalog = mongoose.model("catalog", catalogSchema);
//////////////////////////////////////////////////////

app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
});

app.get("/", function (req, res) //Default Page 
{
    res.render("login.ejs");
});

app.get("/about", function (req, res) //Default Page 
{
    res.render("about.ejs");
});

app.get("/contact", function (req, res) //Default Page 
{
    res.render("contact.ejs");
});

app.get("/login", function (req, res) //Default Page 
{
    res.render("login.ejs");
});

app.get("/loginx2", (req, res) => {
    User.findOne({ userid: req.query.userid }, '', function (err, data) {
        console.log("User found:", data !== null);

        if (err) return handleError(err);
        if (data == null) {
            if (err) return handleError(err);
            res.render("login", { message: "Invalid Userid" });
        }
        else {
            bcrypt.compare(req.query.password, data.password,
                function (err, result) {
                    console.log("Password matched:", result);
                    console.log("Bcrypt error:", err ? err.message : "none");

                    if (result) {
                        res.redirect('/products2');
                    }
                    else {
                        res.render("login", { message: "Invalid Password" });
                    }
                });
        }
    });
});

app.get("/panasonic", function (req, res) //Default Page 
{
    res.render("panasonic.ejs");
});

app.get("/products", function (req, res) //Default Page 
{
    res.render("products.ejs");
});

app.get("/products2", (req, res) => {
    const item2find = new Object();

    Catalog.find(item2find, '', function (err, data) {
        var catalog = ""
        if (err) return handleError(err);
        if (data == "") {
            /* CATALOG IS EMPTY */
        }
        else {
            let catdata = "";
            for (var i = 0; i < data.length; i++) {
                catdata +=
                    `
                
<div style="border:solid green 1px; background:#FFFFFF; float:left; width:460px; height:340px; box-sizing:border-box;">
      <span class="left"><a href="/sony"><img src="images/${data[i].image}" 
style="width:200px; height:250px; object-fit:contain;" alt="example graphic" /></a></span>
<div class="title">${data[i].name}</div>
      <p>
        ${data[i].description}<br />
         <a href="solopage" onclick=req.session.name=${data[i].code}>More...</a><br />
        <span style="float:right;text-align:left;padding:.5em;">
          <a href="#" onclick="#">Add to Cart</a>&nbsp;&nbsp;<a href="#">Goto Cart</a>
        </span>
      </p>
    </div>
    <p style="clear:both"></p>
                `;
               
            }
             res.render("products.ejs", { catalog: catdata });
        }

    });
});

app.get("/register", function (req, res) //Default Page 
{
    res.render("register.ejs");
});

app.get("/register2", (req, res) => {
    User.findOne({ userid: req.query.userid }, '', function (err, data) {
        if (err) return handleError(err);
        if (data == null) {
            bcrypt.hash(req.query.password, 5, function (err, hashpass) {
                
                req.query.password = hashpass;
                var x = new User(req.query);
                x.save(function (err) {
                    if (err) return handleError(err);
                    res.render("login", { message: 'Registration Succelfull' });
                });
            });
        }
        else {
            res.render("register", { message: 'ERROR: User Already In Database' });
        }
    });
});

app.get("/samsung", function (req, res) //Default Page 
{
    res.render("samsung.ejs");
});

app.get("/sony", function (req, res) //Default Page 
{
    res.render("sony.ejs");
});


app.post('/', function (req, res) {
    let input = "", output = "";
    let choice = req.body["choice"];
    console.log("body=" + getJSONString(req.body));
    console.log("query=" + req.query);
    if (choice == "Clear") input = output = "";
    else if (choice = "Increment") {
        input = parseInt(req.body["num"]);
        output = input + 1;
    }
    res.render("inc2.ejs", { num: input, ans: output });
});
app.listen(3000, function () {
    console.log("server is listening!!!");
});
