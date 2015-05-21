/**
 * Created by Komal on 26/04/15.
 */

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var url = require('url');
var mongo = require('mongodb');
var util = require('util');
var mongojs=require('mongojs');
var monk=require('monk');
var db = monk('localhost:27017/EMS');
var path = require('path');
//var fs = require('fs');
//var qs = require('querystring');
//var feature_array = []
//var outputFilename = 'data/feature.json';
//var db = mongojs('EMS',['feature']);


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
/*
app.put('/feature/:id',function(req,res){
    var id=req.params.id;
    var db=req.db;
    var collection  = db.get('feature');
    //db.feature.findAndModify({query:{_id:mongojs.ObjectId(id)},
   // update:{$set:{name:req.body.name,Email:req.body.Email,phone:req.body.phone}},
  //  new:true}, function (err,doc) {
   //     res.json(doc);
    //});
    });

*/
app.get('/feature1/:id',function(req,res){
     var db = req.db;
        var collection = db.get('feature');
        console.log(id);
        collection.find({_id:id},function(e,docs){
           console.log(docs);
           res.json(docs);

        });
});

app.listen(3000);
console.log("server is listening on port 3000");



/*
 feature_array = feature_array;

 console.log(feature_array);

 var featureName = req.param.name;
 var featureId = req.param.id;
 var featureDescription=req.param.description;
 var feature_prop = {
 "featureName": featureName,
 "featureId": featureId,
 "featureDescription":featureDescription
 }

 feature_array.push(feature_prop);

 console.log(feature_array);

 var manager = "Jane Do";
 feature_array[0].manager = manager;

 console.log(feature_array);

 feature_array.push(feature_prop);

 console.log(feature_array);
 console.log(JSON.stringify(feature_array));


 fs.writeFile(outputFilename, JSON.stringify(feature_array, null, 4), function(err) {
 if(err) {
 console.log(err);
 } else {
 console.log("JSON saved to " + outputFilename);
 }
 });
 */

