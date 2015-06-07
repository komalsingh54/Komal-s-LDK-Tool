/**
 * Created by Komal on 20/05/15.
 */


var express=require('express');
var app=express();
var mongojs=require('mongojs');
var db = mongojs('EMS',['feature']);
var db1 = mongojs('EMS',['product']);
var monk=require('monk');
var db2 = monk('localhost:27017/EMS');
var bodyParser=require('body-parser');


    app.use(express.static(__dirname + "/public"));

    app.use(bodyParser.json());

    app.get('/feature',function(req,res){
        db.feature.find(function (err,docs) {
            res.json(docs);

        });
    });

    app.get('/getProduct',function(req,res){

        db1.product.find(function(err,docs){
            res.json(docs);
        });
    });

    app.post('/feature',function(req,res){
        db.feature.insert(req.body, function (err, doc) {
            res.json(doc);
        });
    });

    app.delete('/getProduct/:id', function (req,res) {

        var id= req.params.id;
        db1.product.remove({_id:mongojs.ObjectId(id)}, function (err, doc) {
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

    app.get('/oneProduct/:id',function(req,res){
        var id = req.params.id;
        db1.product.findOne({_id:mongojs.ObjectId(id)}, function(err,doc){
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

    app.use(function(req,res,next){
        req.db2 = db2;
        next();
    });

    app.post('/Product',function(req,res)
    {
        db1.product.insert(req.body, function (err, doc) {
            res.json(doc);
            console.log(doc);
        });
    });

app.listen(3000);
console.log("server is listening on port 3000");


