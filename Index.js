//Imports
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local")
const sessions = require('express-session');
const cookieParser = require("cookie-parser");


const report = require("./models/report");

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//mongodb+srv://First:RTvh0sFZ10WvVKeY@cluster0.gc1ymp4.mongodb.net/?retryWrites=true&w=majority
//mongodb://localhost:27017/Weather
const DBurl = "mongodb+srv://First:RTvh0sFZ10WvVKeY@cluster0.gc1ymp4.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(DBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Okay I understand that hard coding a username and password is a sin but it is 1 am and this was
//meant to be a funny project for a mate and none of my mates know what github is let alone use it to hack my shit website 
const username = "Jake";
const password = "Chocolate3011@"

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(sessions(sessionConfig))
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(cookieParser());

//Gui Website requests

app.get("/", async (req,res) => {
    res.render("Login");
});

app.post('/user',(req,res) => {
    if (req.body.username == username && req.body.password == password)
    {
        let session = req.session;
        session.userid = "1978@asd2df#";
        console.log(req.session)
        res.redirect("/List");
    } 
    else{
    res.send("403");
    }
})

app.get("/list", async (req,res) => {
    let session = req.session;
    if(session.userid != "1978@asd2df#")
    {
        res.render("login");
    }else{
    const Reports = await report.find({});
    res.render("List", {Reports});
    }
});

app.get("/new", async (req,res) => {
    let session = req.session;
    if(session.userid != "1978@asd2df#")
    {
        res.render("login");
    }else{
    res.render("new");
    }
});

app.post('/Report',async(req,res) => {
    let session = req.session;
    const Report = new report(req.body);
    await Report.save();
    res.render("new");
})

app.get("/Report/:id", async (req,res) => {
    let session = req.session;
    if(session.userid != "1978@asd2df#")
    {
        res.render("login");
    }else{
    const Report = await report.findById(req.params.id);
    res.render("Edit", {Report});
    }
});

app.delete('/update/:id',async(req,res) => {
    const { id } = req.params;
    await report.findByIdAndDelete(id);
    res.redirect("/list");
});

app.post('/update/:id',async(req,res) => {
    const { id } = req.params;
    const test = await report.findById(id);
    const recipe = await report.findByIdAndUpdate(id, { ...req.body});
    res.redirect("/list");
});


//API requests

app.get('/api/report', async(req, res) =>{
    const Reports = await report.find({});
    const i = Math.floor(Math.random() * Reports.length);
    res.status(200).send({
        value: i,
        description: Reports[i].description
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serving on ' + port)
    
})