var login =require("../module/login_api");
var leave = require('../module/leave');
var leaveApi = require('../module/leaveApis');
var overtime = require("../module/overtime");
var overtimeApi = require("../module/overtimeApi");
var festival = require("../module/festival");
var festivalApi = require("../module/festivalApi");
var initUserInfo = require("../util/initUserInfo");
var userInfoManage = require("../module/userInfoManage");
var userInfoManageApi = require("../module/userInfoManageApi");
var opLogApi = require("../module/opLogApi");
var opLog = require("../module/opLog");
var fileDown = require("../module/fileDown");
var config = require("../config.json");
var commons = require("../util/commons");

global.isAuthenticated = function (req, res, next) {
  if (req.session && req.session.passport && req.session.passport.user) {
    console.log("Authenticated, Current user:" + JSON.stringify(req.session.passport.user));
    return next();
  } else {
    console.log("Not Authenticated");
  }
  res.redirect('/login');
};


module.exports = function (app,passport) {

  /* GET login page. */
  app.get('/', function (req, res) {
    res.render("login",{"layout":false});
  });
  app.get('/login', function (req, res) {
    res.render("login",{"layout":false});
  });
  app.get('/index',function (req, res) {

    commons.layout(req.session.passport.user.uid, res,"index");
  });


  moduleLoop(login);
  moduleLoop(overtime);
  moduleLoop(overtimeApi);
  moduleLoop(leave);
  moduleLoop(leaveApi);
  moduleLoop(festival);
  moduleLoop(festivalApi);
  moduleLoop(userInfoManage);
  moduleLoop(userInfoManageApi);
  moduleLoop(opLogApi);
  moduleLoop(opLog);
  moduleLoop(fileDown);
};

function moduleLoop(obj){
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object'){
        for(var attr in obj[key]){
          obj[key][attr]();
        }
      }else{
        obj[key]();
      }
    }
  }
}
