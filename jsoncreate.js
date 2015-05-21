/**
 * Created by KSingh1 on 5/11/2015.
 */
/*var sitePersonel = {};
var employees = []

sitePersonel.employees = employees;

console.log(sitePersonel);

var firstName = "John";
var lastName = "Smith";
var employee = {
    "firstName": firstName,
    "lastName": lastName
}

sitePersonel.employees.push(employee);

console.log(sitePersonel);

var manager = "Jane Doe";
sitePersonel.employees[0].manager = manager;

console.log(sitePersonel);

console.log(JSON.stringify(sitePersonel));
    */



var fs = require('fs');
 var employees = []
var outputFilename = 'data/feature.json';
employees = employees;

 console.log(employees);

 var firstName = "John";
 var lastName = "Smith";
 var employee = {
 "firstName": firstName,
 "lastName": lastName
 }

employees.push(employee);

 console.log(employees);

 var manager = "Jane Doe";
employees[0].manager = manager;

 console.log(employees);

employees.push(employee);

console.log(employees);
 console.log(JSON.stringify(employees));


fs.writeFile(outputFilename, JSON.stringify(employees, null, 4), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("JSON saved to " + outputFilename);
    }
});
