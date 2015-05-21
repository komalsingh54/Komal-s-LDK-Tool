/**
 * Created by Komal on 20/05/15.
 */


var express=require('express');
var app=express();
var mongojs=require('mongojs');
var db = mongojs('EMS',['feature']);
var bodyParser=require('body-parser');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.get('/feature',function(req,res){
    db.feature.find(function (err,docs) {
        res.json(docs);

    });
});


app.post('/feature',function(req,res){
    db.feature.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

app.delete('/feature/:id', function (req,res) {
    var id= req.params.id;
    db.feature.remove({_id:mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});
app.get('/feature/:id',function(req,res){
    var id = req.params.id;
    db.feature.findOne({_id:mongojs.ObjectId(id)}, function(err,doc){
        res.json(doc);
    });
});
app.put('/feature/:id',function(req,res){
    var id=req.params.id;
    db.feature.findAndModify({query:{_id:mongojs.ObjectId(id)},
        update:{$set:{featureID:req.body.featureID,featureName:req.body.featureName,featureDescription:req.body.featureDescription}},
        new:true}, function (err,doc) {
        res.json(doc);
    });
});
app.listen(3000);
console.log("server is listening on port 3000");





/*
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var url=require('url');
var monk=require('monk');
var db = monk('localhost:27017/EMS');
var path = require('path');

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.post('/feature',function(req,res){

    var db=req.db;
    var collection=db.get('feature');
    var name=req.body.name;
    var disc=req.body.disc;
    var id=req.body.id;
    console.log(body);
    collection.insert({"featureName":name,
        "featureDescription":disc,
        "featureID":id}, function (err, doc) {
        if(err)
        {
            res.send("there was a problem to sending the data");
        }
        else {
            res.json(doc);
            //console.log(doc);
        }
    });
});

app.get('/feature', function(req, res) {
    var db = req.db;
    var collection = db.get('feature');
    collection.find({},function(e,docs){
        res.json(docs);

    });
});


app.delete('/feature/:id', function (req,res) {
    console.log("deletion request");
    var id= req.params.id;
    console.log(id);
    var db=req.db;
    var collection  = db.get('feature');
    collection.remove({_id:id}, function (err, doc) {
        res.json(doc);
    });
});


app.get('/feature/:id',function(req,res){
    var db = req.db;
    var collection = db.get('feature');
    var id=req.params.id;
    console.log(id);
    console.log("in server");
    collection.find({_id:id},function(e,docs){
        console.log(docs);
        res.json(docs);

    });
});

app.listen(3000);
console.log("server is listening on port 3000");
    */