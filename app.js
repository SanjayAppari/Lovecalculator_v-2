const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
mongoose.connect('mongodb://localhost:27017/love_cal_V-2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
}).then(db => console.log('DB is connected'))
    .catch(err => console.log(err));
mongoose.set('strictQuery', true);


const pair_schema = new mongoose.Schema({
    fname: String,
    sname: String
});

const app = express();

const Pair = mongoose.model("pair", pair_schema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));


app.get("/", (req, res) => {
    res.render('index' ,{p:"It's All About RelationShip !!"});
})


app.post("/insert", function (req, res) {
    console.log("hi");
    const couple = new Pair({
        fname: req.body.fname,
        sname: req.body.sname
    });
    couple.save();
    let n1=req.body.fname;
    let n2=req.body.sname;
    let o1=n1;
    let o2=n2;
    n1 = n1.toLowerCase();
    n2 = n2.toLowerCase();
    let m1 = {};
    let m2 = {};
    for (let i = 0; i < n1.length; i++) {
        if (n1[i] != ' ') {
            if (m1[n1[i]] == undefined) {
                m1[n1[i]] = 1;
            }
            else {
                m1[n1[i]] += 1;
            }
        }
    }
    for (let i = 0; i < n2.length; i++) {
        if (n2[i] != ' ') {
            if (m2[n2[i]] == undefined) {
                m2[n2[i]] = 1;
            }
            else {
                m2[n2[i]] += 1;
            }
        }
    }
    let c = 0;
    for (let i = 0; i < n1.length; i++) {
        if (m2[n1[i]] != undefined && m1[n1[i]] != undefined) {
            if (m1[n1[i]] == m2[n1[i]]) {
                m1[n1[i]] = undefined;
                m2[n1[i]] = undefined;
            }
            else if (m1[n1[i]] == 1) {
                m2[n1[i]] -= 1;
                m1[n1[i]] = undefined;
            }
            else if (m2[n1[i]] == 1) {
                m1[n1[i]] -= 1;
                m2[n1[i]] = undefined;
            }
            else {
                if (m1[n1[i]] > m2[n1[i]]) {
                    m1[n1[i]] -= m2[n1[i]];
                    m2[n1[i]] = undefined;
                }
                else {
                    m2[n1[i]] -= m1[n1[i]];
                    m1[n1[i]] = undefined;
                }
            }
        }
    }
    c = 0;
    for (let i = 0; i < n1.length; i++) {
        // document.write(m1[n1[i]]+" ");
        if (m1[n1[i]] == undefined) continue;
        else {
            c += m1[n1[i]];
            // document.write(c+" ");
            m1[n1[i]] = undefined;
        }
        // document.write(c+" ");
    }
    // document.write(c);
    for (let i = 0; i < n2.length; i++) {
        if (m2[n2[i]] != undefined) {
            c += m2[n2[i]];
            m2[n2[i]] = undefined;
        }
    }
    var s = "flames";
    var n = 6;
    while (n != 1) {
        var k = c % n;
        if (k == 0)
            var s1 = s.substring(0, n - 1);
        else {
            var s1 = s.substring(k, n) + s.substring(0, k - 1);
        }
        s = s1;
        n--;
    }
    n1 = o1;
    n2 = o2;
    var p="";
    if (s == "e") {
        p = n1 + " and " + n2 + " are ENEMIES";
        // document.getElementById("p1").innerHTML = p;
    }
    else if (s == "f") {
         p = n1 + " and " + n2 + " are FRIENDS";
        // document.getElementById("p1").innerHTML = p;
    }
    else if (s == "l") {
         p = n1 + " and " + n2 + " are LOVERS";
        // document.getElementById("p1").innerHTML = p;
    }
    else if (s == "a") {
         p = "There Is Just ATTRACTION BETWEEN " + n1 + " and " + n2;
        // document.getElementById("p1").innerHTML = p;
    }
    else if (s == "m") {
         p = n1 + " and " + n2 + " are Going To MARRY EACHOTHER";
        // document.getElementById("p1").innerHTML = p;
    }
    else if (s == "s") {
         p = n1 + " and " + n2 + " are SIBLINGS";
        // document.getElementById("p1").innerHTML = p;
    }
    res.render('index', {p:p});
});




app.listen(3000, () => {
    console.log("Server started at 3000");
});