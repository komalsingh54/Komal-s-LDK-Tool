/**
 * Created by Komal on 20/05/15.
 */

var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('EMS', ['feature']);
var db1 = mongojs('EMS', ['product']);
var db3 = mongojs('EMS', ['LicDefine']);
var db4 = mongojs('EMS', ['LicenseTemplate']);
var db5 = mongojs('EMS', ['Provisional']);
var db6 = mongojs('EMS', ['Modify']);
var db7 = mongojs('EMS', ['Cancel']);
var db8 = mongojs('EMS', ['ProvisionalTemplate']);
var monk = require('monk');
var db2 = monk('localhost:27017/EMS');
var bodyParser = require('body-parser');
var fs = require('fs');
var ref = require('ref');
var ffi = require('ffi');
var lic_gen = require('src/lic_gen');
var parser = require("xml2json");
var parseurl = require('parseurl');
var session = require('express-session');
var multer = require('multer');
var js2xmlparser = require("js2xmlparser");
var methodOverride = require('method-override');
var views;
var sess;
var done = false;

//app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + "/public"));
app.set('src', __dirname + '/src');

//handling errors on request and responses
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//handles the log errors
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
//handles XHR request errors
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({error: 'Something blew up!'});
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {error: err});
}

//bootstraping sessions
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));

// session counts
app.use(function (req, res, next) {
    //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
    views = req.session.views;
    if (!views) {
        views = req.session.views = {}
    }

    //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
    var pathname = parseurl(req).pathname;
    //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
    views[pathname] = (views[pathname] || 0) + 1;
    next()
});

app.get('/', function (req, res) {
    sess = req.session;
    if (sess.username) {
        res.redirect('/index.html');
    } else {
        res.render('index.html');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.post('/login', function (req, res) {
    sess = req.session;
    sess.username = req.body.username;
    sess.pass = req.body.pass;
    if (sess.username === 'admin' && sess.pass === 'admin') {
        res.end('done');
    } else
        res.status(404);
});


app.get('/feature', function (req, res) {

    db.feature.find(function (err, docs) {
        res.json(docs);
    });
});

app.get('/featuredisplay/', function (req, res) {
    db.feature.find(function (err, doc) {
        res.json(doc);
    });
});

app.get('/deletedisable', function (req, res) {
    db1.product.find(function (err, doc) {
        res.json(doc);
    });
});

//store features data from the client
app.post('/feature', function (req, res) {
    db.feature.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

//delete selected feature requested by the client
app.delete('/feature/:id', function (req, res) {
    var id = req.params.id;
    db.feature.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

//send one feature to the client
app.get('/feature/:id', function (req, res) {
    var id = req.params.id;
    db.feature.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

/*  Product Controllers */

//send product data to the client
app.get('/getProduct', function (req, res) {
    db1.product.find(function (err, docs) {
        res.json(docs);
    });
});

//delete selected product requested by the client
app.delete('/getProduct/:id', function (req, res) {
    var id = req.params.id;
    db1.product.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

app.get('/showTemplate', function (req, res) {
    db4.LicenseTemplate.find(function (err, docs) {
        res.json(docs);
    });
});

app.get('/getProvisionalProduct', function (req, res) {
    db5.Provisional.find(function (err, doc) {
        res.json(doc);
    })
});

app.get('/getOneProduct/:id', function (req, res) {
    var id = req.params.id;
    db1.product.find({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    })
});

//send one product to the client
app.get('/oneProduct/:id', function (req, res) {
    var id = req.params.id;
    db1.product.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);

    });
});

app.get('/oneProductE/:id', function (req, res) {
    var id = req.params.id;

    db1.product.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);

    });
});

app.get('/getEditFeature/:id/:featureid', function (req, res) {
    var id = req.params.id;
    var featureid = req.params.featureid;
    db1.product.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/oneProductU/:id', function (req, res) {
    var id = req.params.id;
    db1.product.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                productID: req.body.productID,
                productName: req.body.productName,
                productDescription: req.body.productDescription,
                productLockingType: req.body.productLockingType,
                clone_protection_ex: {
                    virtual_machine: req.body.clone_protection_ex.virtual_machine,
                    physical_machine: req.body.clone_protection_ex.physical_machine
                }
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    });

});

app.put('/updatefeature/:id/:featureid', function (req, res) {
    var id = req.params.id;
    var name = req.body.name3;
    var featureid = req.params._id;
    db1.product.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull: {
            "feature": {
                "_id": name._id
            }
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    db1.product.update({
        _id: mongojs.ObjectId(id)
    }, {
        $push: {
            "feature": name
        }
    }, function (err, doc) {
        res.json(doc);
    });
});
/*
 app.put('/cancelFeature/:featureID/:productID', function(req, res) {
 var productID = req.params.productID;
 var featureID = req.params.featureID;
 db1.product.update({_id:mongojs.ObjectId(productID), "feature._id":featureID
 }, {$set: { "feature.$.cancel" : "true" }}, { upsert: true }, function (err, doc) {
 console.log(err);
 console.log(doc);
 });
 res.send('done');
 });
 */
app.use(function (req, res, next) {
    req.db2 = db2;
    next();
});

//store the product
app.post('/Product', function (req, res) {
    db1.product.insert(req.body, function (err, doc) {
        if (err)
            console.log(err);
        res.json(doc);

    });
});

//decode c2v
app.post('/c2v_xml', function (req, res) {
    var current_state = fs.readFileSync('var/c2v/licensec2v.c2v', "utf8");
    var vendor_code = fs.readFileSync('var/DEMOMA.hvc', "utf8");
    var result = lic_gen.ldk_decode_license(vendor_code, current_state);

    if (result == Number(result))
        res.status(500).json(result);
    else {
        res.send(parser.toJson(result));
    }
});

app.delete('/delTemplate/:id', function (req, res) {
    var id = req.params.id;
    db8.ProvisionalTemplate.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
app.delete('/deleteTemplate/:id', function (req, res) {
    var id = req.params.id;
    db4.LicenseTemplate.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    })
});

//update feature
app.put('/feature/:id', function (req, res) {
    var id = req.params.id;
    db.feature.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                featureID: req.body.featureID,
                featureName: req.body.featureName,
                featureDescription: req.body.featureDescription
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    });
});

var f;
// to update the existing featurelicence


app.put('/addProvisionalProduct', function (req, res) {

    db1.product.update({
        productID: req.body.id
    }, {
        $push: {
            provisional: req.body
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    db5.Provisional.insert(req.body, function (err, doc) {
        if (err)
            console.log(err);
    });
    res.json("done");
});

app.put('/updateProductStatus/:id', function (req, res) {
    var id = req.params.id;
    db1.product.update({_id: mongojs.ObjectId(id)}, {$set: {"flag": req.body.flag}}, function (err, doc) {
        res.json("done");
    });
});

app.put('/addModifyProduct', function (req, res) {
    db1.product.update({
        productID: req.body.id
    }, {
        $push: {
            modify: req.body
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    db6.Modify.insert(req.body, function (err, doc) {
        if (err)
            console.log(err);
    });
    res.send("done");

});

app.put('/addCancelProduct', function (req, res) {
    db1.product.update({
        productID: req.body.id
    }, {
        $push: {
            Cancel: req.body
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    db7.Cancel.insert(req.body, function (err, doc) {
        if (err)
            console.log(err);
    });
    res.json("done");
});


app.get('/showProvisionTemplate', function (req, res) {
    db8.ProvisionalTemplate.find(function (err, docs) {
        res.json(docs);
    });
});

app.put('/deletefeature/:id/:featureid', function (req, res) {
    var id = req.params.id;
    var featureid = req.params.featureid;
    db1.product.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull: {
            'feature': {
                "_id": featureid
            }
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    res.send("done");
});

app.put('/cancelDel/:id/:cancelId', function (req, res) {
    var id = req.params.id;
    var cancelId = req.params.cancelId;
    db1.product.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull: {
            'Cancel': {
                'id': cancelId
            }
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    res.send("done pull");
});

app.put('/provisionDel/:id/:provisionId', function (req, res) {
    var id = req.params.id;
    var provisionId = req.params.provisionId;
    db1.product.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull: {
            'provisional': {
                'id': provisionId
            }
        }
    }, function (err, doc) {
        console.log(doc);
        if (err)
            console.log(err);
    });
    res.send("done pull");
});

app.put('/modifyDel/:id/:modifyId', function (req, res) {
    var id = req.params.id;
    var modifyId = req.params.modifyId;
    db1.product.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull: {
            'modify': {
                'id': modifyId
            }
        }
    }, function (err, doc) {
        if (err)
            console.log(err);
    });
    res.send("done pull");
});

app.post('/draftProvisionalLicense1', function (req, res) {
    db8.ProvisionalTemplate.insert(req.body, function (err, doc) {
        res.json("Inserted");
    })
});

app.post('/draftLicense1', function (req, res) {
    db4.LicenseTemplate.insert(req.body, function (err, doc) {
        res.json("Inserted");
    });
});

app.post('/produceProvisionalLicense2', function (req, res) {

    var licdata = req.body;
    var feature = [];
    var product = [];
    var temp = [];
    var memory = {};
    for (var i in licdata.product) {
        for (var j in licdata.product[i].feature) {
            if (licdata.product[i].feature[j].perpetual === 'perpetual') {
                var license_properties = {};
                license_properties['perpetual'] = null;
                license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                if (licdata.enforcement_type != 'HL')
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
            }
            if (licdata.product[i].feature[j].execution_count === 'execution_count') {
                var license_properties = {};
                license_properties['execution_count'] = licdata.product[i].feature[j].execution_count;
                license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
            }
            if (licdata.product[i].feature[j].days_to_expiration === 'days_to_expiration') {
                var license_properties = {};
                license_properties['days_to_expiration'] = licdata.product[i].feature[j].days_to_expiration;
                license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
            }

            feature[j] = {
                "id": licdata.product[i].feature[j].featureID,
                "name": licdata.product[i].feature[j].featureName,
                "license_properties": license_properties
            }
        }

        for (var j in licdata.product[i].memory) {
            memory[licdata.product[i].memoryType] = {
                "offset": licdata.product[i].memory[j].offset,
                "content": licdata.product[i].memory[j].content
            };
        }
        product[i] = {
            "id": licdata.product[i].id,
            "name": licdata.product[i].name,
            feature: feature
        };
    }
    if (memory == {}) {
        var var1 = {
            readable_license: licdata.readable_license,
            enforcement_type: licdata.enforcement_type,
            product: product
        };
    }
    else {
        var var1 = {
            readable_license: licdata.readable_license,
            enforcement_type: licdata.enforcement_type,
            product: product,
            memory: memory
        };
    }
    var xml_buffer = js2xmlparser("sentinel_ldk:license", JSON.stringify(var1));
    var result1 = xml_buffer.replace(/<sentinel_ldk:license>/g, '<sentinel_ldk:license schema_version=\"1.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sentinel_ldk=\"http://www.safenet-inc.com/sentinelldk\">');
    fs.writeFile('./var/licenseDefination.xml', result1, 'utf8', function (err) {
        if (err) return console.log(err);
    });


    db8.ProvisionalTemplate.findAndModify({
        query: {_id: mongojs.ObjectId(req.body._id)},
        update: {$set: {status: 'Generated'}},
        new: true
    });
    var license_type = 4;
    var current_state = null;
    var vendor_code = fs.readFileSync('var/DEMOMA.hvc', "utf8");
    var license_definition = result1;
    var result = lic_gen.ldk_generate_license(vendor_code, license_type, license_definition, current_state);
    if (result == Number(result))
        res.status(500).json(result);
    else {
        res.json(result);
    }
});

app.post('/produceProvisionalLicense1', function (req, res) {

    var licdata = req.body;
    var feature = [];
    var product = [];
    var temp = [];
    var memory = {};
    for (var i in licdata.product) {
        for (var j in licdata.product[i].feature) {
            if (licdata.product[i].feature[j].perpetual === 'perpetual') {
                var license_properties = {};
                license_properties['perpetual'] = null;
                license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                if (licdata.enforcement_type != 'HL')
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
            }
            if (licdata.product[i].feature[j].execution_count === 'execution_count') {
                var license_properties = {};
                license_properties['execution_count'] = licdata.product[i].feature[j].execution_count;
                license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
            }
            if (licdata.product[i].feature[j].days_to_expiration === 'days_to_expiration') {
                var license_properties = {};
                license_properties['days_to_expiration'] = licdata.product[i].feature[j].days_to_expiration;
                license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
            }

            feature[j] = {
                "id": licdata.product[i].feature[j].featureID,
                "name": licdata.product[i].feature[j].featureName,
                "license_properties": license_properties
            }
        }

        for (var j in licdata.product[i].memory) {
            memory[licdata.product[i].memoryType] = {
                "offset": licdata.product[i].memory[j].offset,
                "content": licdata.product[i].memory[j].content
            };
        }
        product[i] = {
            "id": licdata.product[i].id,
            "name": licdata.product[i].name,
            feature: feature
        };

    }
    if (memory == {}) {
        var var1 = {
            readable_license: licdata.readable_license,
            enforcement_type: licdata.enforcement_type,
            product: product
        };
    }
    else {
        var var1 = {
            readable_license: licdata.readable_license,
            enforcement_type: licdata.enforcement_type,
            product: product,
            memory: memory
        };
    }
    var xml_buffer = js2xmlparser("sentinel_ldk:license", JSON.stringify(var1));
    var result1 = xml_buffer.replace(/<sentinel_ldk:license>/g, '<sentinel_ldk:license schema_version=\"1.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sentinel_ldk=\"http://www.safenet-inc.com/sentinelldk\">');
    fs.writeFile('./var/licenseDefination.xml', result1, 'utf8', function (err) {
        if (err) return console.log(err);
    });

    var license_type = 4;
    var current_state = null;
    var vendor_code = fs.readFileSync('var/DEMOMA.hvc', "utf8");
    var license_definition = result1;
    var result = lic_gen.ldk_generate_license(vendor_code, license_type, license_definition, current_state);
    if (result == Number(result))
        res.status(500).json(result);
    else {
        db8.ProvisionalTemplate.insert(req.body);
        res.json(result);
    }
});

app.post('/produceLicense1', function (req, res) {
    var flag = true;
    db4.LicenseTemplate.insert(req.body);
    var licdata = req.body;
    var feature = [];
    var product = [];
    var memory = {};
    var temp = [];

    if (licdata.enforcement_type == 'SL-UserMode') {
        for (var i in licdata.product) {
            for (var j in licdata.product[i].feature) {

                var temp2;
                if (!licdata.product[i].feature[j].counts)
                    temp2 = licdata.product[i].feature[j].concurrentInstances;
                else
                    temp2 = licdata.product[i].feature[j].counts;

                if (licdata.product[i].feature[j].perpetual === 'perpetual') {
                    var license_properties = {};
                    license_properties['perpetual'] = null;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    if (licdata.enforcement_type != 'HL')
                        license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].execution_count === 'execution_count') {
                    var license_properties = {};
                    license_properties['execution_count'] = licdata.product[i].feature[j].execution_count;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].days_to_expiration === 'days_to_expiration') {
                    var license_properties = {};
                    license_properties['days_to_expiration'] = licdata.product[i].feature[j].days_to_expiration;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }

                if (licdata.product[i].feature[j].cancelFeature == true) {
                    feature[j] = {
                        "@": {
                            "action": "cancel"
                        },
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
                else {
                    feature[j] = {
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
            }

            for (var j in licdata.product[i].memory) {
                //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
                flag = false;
                temp[i] = {
                    "offset": licdata.product[i].memory[j].offset,
                    "content": licdata.product[i].memory[j].content
                };
                memory[licdata.product[i].memoryType] = temp;
            }

            if (licdata.product[i].cancelProduct == true){
                product[i] = {
                    "@": {
                        "action": "cancel"
                    },
                    "id": licdata.product[i].productID,
                    "name": licdata.product[i].productName,
                    feature: feature
                }
            }
            else {
                product[i] = {
                    "id": licdata.product[i].productID,
                    "name": licdata.product[i].productName,
                    feature: feature
                }
            }
        }
    }

    else {
        for (var i in licdata.product) {
            for (var j in licdata.product[i].feature) {
                var concurrency = {};
                var temp2;
                if (!licdata.product[i].feature[j].counts)
                    temp2 = licdata.product[i].feature[j].concurrentInstances;
                else
                    temp2 = licdata.product[i].feature[j].counts;
                concurrency['count'] = temp2;
                concurrency['count_criteria'] = licdata.product[i].feature[j].countCriteria;
                concurrency['network_access'] = licdata.product[i].feature[j].network;
                if (licdata.product[i].feature[j].perpetual === 'perpetual') {
                    var license_properties = {};
                    license_properties['perpetual'] = null;
                    if (concurrency.count == undefined || concurrency.concurrentInstances == undefined || concurrency.count_criteria == undefined || concurrency.network == undefined)
                        license_properties['concurrency'] = concurrency;

                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    if (licdata.enforcement_type != 'HL')
                        license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].execution_count === 'execution_count') {
                    var license_properties = {};
                    license_properties['execution_count'] = licdata.product[i].feature[j].execution_count;
                    if (licdata.product[i].feature[j].counts != '' || licdata.product[i].feature[j].concurrentInstances != '' || licdata.product[i].feature[j].count_criteria != '' || licdata.product[i].network != '')
                        license_properties['concurrency'] = concurrency;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].days_to_expiration === 'days_to_expiration') {
                    var license_properties = {};
                    license_properties['days_to_expiration'] = licdata.product[i].feature[j].days_to_expiration;
                    if (licdata.product[i].feature[j].counts != '' || licdata.product[i].feature[j].concurrentInstances != '' || licdata.product[i].feature[j].count_criteria != '' || licdata.product[i].network != '')
                        license_properties['concurrency'] = concurrency;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }

                if (licdata.product[i].feature[j].cancelFeature) {
                    feature[j] = {
                        "@": {
                            "action": "cancel"
                        },
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
                else {
                    feature[j] = {
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
            }

            for (var j in licdata.product[i].memory) {
                //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
                flag = false;
                temp[i] = {
                    "offset": licdata.product[i].memory[j].offset,
                    "content": licdata.product[i].memory[j].content
                };
                memory[licdata.product[i].memoryType] = temp;
            }
            
            if (licdata.product[i].cancelProduct == true){

                product[i] = {
                    "@": {
                        "action": "cancel"
                    },
                    "id": licdata.product[i].productID,
                    "name": licdata.product[i].productName,
                    feature: feature
                }
            }
            else {

                product[i] = {
                    "id": licdata.product[i].productID,
                    "name": licdata.product[i].productName,
                    feature: feature
                }
            }
        }
    }
    if (flag) {
        var var1 = {
            readable_license: licdata.readable_license,
            acknowledgement_request: licdata.acknowledgement_request,
            enforcement_type: licdata.enforcement_type,
            rehost: licdata.rehost,
            upgrade_to_driverless: licdata.upgrade_to_driverless,
            enable_sl_legacy_support: licdata.enable_sl_legacy_support,
            product: product
        };
    }
    else {
        var var1 = {
            readable_license: licdata.readable_license,
            acknowledgement_request: licdata.acknowledgement_request,
            enforcement_type: licdata.enforcement_type,
            rehost: licdata.rehost,
            upgrade_to_driverless: licdata.upgrade_to_driverless,
            enable_sl_legacy_support: licdata.enable_sl_legacy_support,
            product: product,
            memory: memory
        };
    }

    var xml_buffer = js2xmlparser("sentinel_ldk:license", JSON.stringify(var1));
    var result = xml_buffer.replace(/<sentinel_ldk:license>/g, '<sentinel_ldk:license  schema_version=\"1.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sentinel_ldk=\"http://www.safenet-inc.com/sentinelldk\">');
    fs.writeFile('./var/licenseDefination.xml', result, 'utf8', function (err) {
        if (err) return console.log(err);
    });

    flag = true;
    res.json("done");

});

app.post('/generateDraftKey', function (req, res) {
    var licdata = req.body;
    var feature = [];
    var product = [];
    var memory = {};
    var temp = [];

    if (licdata.enforcement_type == 'SL-UserMode') {
        for (var i in licdata.product) {
            for (var j in licdata.product[i].feature) {

                var temp2;
                if (!licdata.product[i].feature[j].counts)
                    temp2 = licdata.product[i].feature[j].concurrentInstances;
                else
                    temp2 = licdata.product[i].feature[j].counts;

                if (licdata.product[i].feature[j].perpetual === 'perpetual') {
                    var license_properties = {};
                    license_properties['perpetual'] = null;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    if (licdata.enforcement_type != 'HL')
                        license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].execution_count === 'execution_count') {
                    var license_properties = {};
                    license_properties['execution_count'] = licdata.product[i].feature[j].execution_count;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].days_to_expiration === 'days_to_expiration') {
                    var license_properties = {};
                    license_properties['days_to_expiration'] = licdata.product[i].feature[j].days_to_expiration;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }

                if (licdata.product[i].feature[j].cancelFeature == true) {
                    feature[j] = {
                        "@": {
                            "action": "cancel"
                        },
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
                else {
                    feature[j] = {
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
            }

            for (var j in licdata.product[i].memory) {
                //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
                flag = false;
                temp[i] = {
                    "offset": licdata.product[i].memory[j].offset,
                    "content": licdata.product[i].memory[j].content
                };
                memory[licdata.product[i].memoryType] = temp;
            }

            product[i] = {
                "id": licdata.product[i].productID,
                "name": licdata.product[i].productName,
                feature: feature
            }
        }
    }

    else {
        for (var i in licdata.product) {
            for (var j in licdata.product[i].feature) {
                var concurrency = {};
                var temp2;
                if (!licdata.product[i].feature[j].counts)
                    temp2 = licdata.product[i].feature[j].concurrentInstances;
                else
                    temp2 = licdata.product[i].feature[j].counts;
                concurrency['count'] = temp2;
                concurrency['count_criteria'] = licdata.product[i].feature[j].countCriteria;
                concurrency['network_access'] = licdata.product[i].feature[j].network;

                if (licdata.product[i].feature[j].perpetual === 'perpetual') {
                    var license_properties = {};
                    license_properties['perpetual'] = null;
                    if (concurrency.count == undefined || concurrency.concurrentInstances == undefined || concurrency.count_criteria == undefined || concurrency.network == undefined)
                        license_properties['concurrency'] = concurrency;

                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    if (licdata.enforcement_type != 'HL')
                        license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].execution_count === 'execution_count') {
                    var license_properties = {};
                    license_properties['execution_count'] = licdata.product[i].feature[j].execution_count;
                    if (licdata.product[i].feature[j].counts != '' || licdata.product[i].feature[j].concurrentInstances != '' || licdata.product[i].feature[j].count_criteria != '' || licdata.product[i].network != '')
                        license_properties['concurrency'] = concurrency;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }
                if (licdata.product[i].feature[j].days_to_expiration === 'days_to_expiration') {
                    var license_properties = {};
                    license_properties['days_to_expiration'] = licdata.product[i].feature[j].days_to_expiration;
                    if (licdata.product[i].feature[j].counts != '' || licdata.product[i].feature[j].concurrentInstances != '' || licdata.product[i].feature[j].count_criteria != '' || licdata.product[i].network != '')
                        license_properties['concurrency'] = concurrency;
                    license_properties['remote_desktop_access'] = licdata.product[i].feature[j].remotedesktop;
                    license_properties['virtual_machine_access'] = licdata.product[i].feature[j].vm;
                }

                if (licdata.product[i].feature[j].cancelFeature == true) {
                    feature[j] = {
                        "@": {
                            "action": "cancel"
                        },
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }
                else {
                    feature[j] = {
                        "id": licdata.product[i].feature[j].featureID,
                        "name": licdata.product[i].feature[j].featureName,
                        "license_properties": license_properties
                    }
                }

            }

            for (var j in licdata.product[i].memory) {
                //noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
                flag = false;
                temp[i] = {
                    "offset": licdata.product[i].memory[j].offset,
                    "content": licdata.product[i].memory[j].content
                };
                memory[licdata.product[i].memoryType] = temp;
            }

            product[i] = {
                "id": licdata.product[i].productID,
                "name": licdata.product[i].productName,
                feature: feature
            }
        }
    }


    if (flag) {
        var var1 = {
            readable_license: licdata.readable_license,
            acknowledgement_request: licdata.acknowledgement_request,
            enforcement_type: licdata.enforcement_type,
            rehost: licdata.rehost,
            upgrade_to_driverless: licdata.upgrade_to_driverless,
            enable_sl_legacy_support: licdata.enable_sl_legacy_support,
            product: product
        };
    }
    else {
        var var1 = {
            readable_license: licdata.readable_license,
            acknowledgement_request: licdata.acknowledgement_request,
            enforcement_type: licdata.enforcement_type,
            rehost: licdata.rehost,
            upgrade_to_driverless: licdata.upgrade_to_driverless,
            enable_sl_legacy_support: licdata.enable_sl_legacy_support,
            product: product,
            memory: memory
        };
    }

    var xml_buffer = js2xmlparser("sentinel_ldk:license", JSON.stringify(var1));
    var result1 = xml_buffer.replace(/<sentinel_ldk:license>/g, '<sentinel_ldk:license  schema_version=\"1.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sentinel_ldk=\"http://www.safenet-inc.com/sentinelldk\">');
    fs.writeFileSync('./var/licenseDefination.xml', result1, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    var license_type = 1;

    if (licdata.enforcement_type === 'HL')
        var current_state = fs.readFileSync('var/c2v/hl.c2v', "utf8");
    if (licdata.enforcement_type === 'SL-AdminMode')
        var current_state = fs.readFileSync('var/c2v/lc2.c2v', "utf8");
    if (licdata.enforcement_type == 'SL-UserMode')
        var current_state = fs.readFileSync('var/c2v/SL-UM_C2V.c2v', "utf8");
    var vendor_code = fs.readFileSync('var/DEMOMA.hvc', "utf8");
    var license_definition = result1;//fs.readFileSync('var/licenseDefination.xml', "utf8");
    var result = lic_gen.ldk_generate_license(vendor_code, license_type, license_definition, current_state);
    fs.writeFileSync('src/lic_generated.v2c', result, 'utf8', function (err) {
        if (err)
            return console.log(err);
    });

    db4.LicenseTemplate.findAndModify({
        query: {_id: mongojs.ObjectId(req.body._id)},
        update: {$set: {status: 'Generated'}},
        new: true
    });
    if (result == Number(result))
        res.status(500).json(result);
    else {
        res.json(result);
    }
});

app.post('/generate_key', function (req, res) {
    var license_type = 1;
    var current_state = fs.readFileSync('var/c2v/licensec2v.c2v', "utf8");
    var vendor_code = fs.readFileSync('var/DEMOMA.hvc', "utf8");
    var license_definition = fs.readFileSync('var/licenseDefination.xml', "utf8");
    var result = lic_gen.ldk_generate_license(vendor_code, license_type, license_definition, current_state);

    if (result == Number(result))
        res.status(500).json(result);
    else {
        res.json(result);
    }
});

//store the license definition
app.post('/LicDefine', function (req, res) {
    var xml_buffer = js2xmlparser("sentinel_ldk:license", req.body);
    var result = xml_buffer.replace(/<sentinel_ldk:license>/g, '<sentinel_ldk:license  schema_version=\"1.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sentinel_ldk=\"http://www.safenet-inc.com/sentinelldk\">');
    fs.writeFile('data/lic.xml', result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    db3.LicDefine.insert(req.body);
    res.json();

});

app.use(multer({
    dest: './var/c2v',
    rename: function (fieldname, filename) {
        return filename.replace(filename, 'licensec2v');
    },
    onFileUploadStart: function (file) {
    },
    onFileUploadComplete: function (file) {
        fs.readFileSync(file.path, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
        });
        done = true;
    }
}));

app.post('/api/photo', function (req, res) {
    if (done == true) {
        res.json("file uploaded");
    }
});

app.post('/compatibleDevice', function (req, res) {

    var license_type = 1;
    var current_state = fs.readFileSync('var/c2v/licensec2v.c2v', "utf8");
    var vendor_code = fs.readFileSync('var/DEMOMA.hvc', "utf8");
    var license_definition = fs.readFileSync('var/licenseDefination.xml', "utf8");
    var result = lic_gen.ldk_get_capable_devices(vendor_code, license_definition, current_state, license_type);

    if (result == Number(result))
        res.status(500).json(result);
    else {
        res.send(parser.toJson(result));
    }

});

app.put('/update_feature_collection/:id', function (req, res) {
    var id = req.params.id;
    db.feature.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                flag: req.body.flag
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/update_product_status/:id', function (req, res) {
    var id = req.params.id;
    db1.product.findAndModify({
        query: {
            _id: mongojs.ObjecId(id)
        },
        update: {
            $set: {
                flag: req.body.flag
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    });
});

app.listen(3000);
console.log("server is listening on port 3000");