var express = require("express");
var Stack = require("./stack");

var apiDefinitions = express.Router();

apiDefinitions.get("/push/:data", function (req, res) {
    var inputData = req.params.data;
    let stackData = req.session.stackData;
    let stack = new Stack(stackData);
    stack.push(inputData);
    req.session.stackData = stack.toString();
    res.send(stack.toString());
});

apiDefinitions.get("/pop", function (req, res) {
    let stack;
    stack = new Stack(req.session.stackData);
    
    var elet = stack.pop();
    req.session.stackData = stack.toString();
    
    res.send({ 'data': elet });
});

apiDefinitions.get("/serialize", function (req, res) {
    let stack = new Stack(req.session.stackData);
    var stackData = stack.toString();
    res.send(stackData);
});

module.exports = apiDefinitions;