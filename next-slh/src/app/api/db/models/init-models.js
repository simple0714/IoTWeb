var DataTypes = require("sequelize").DataTypes;
var _ABOUT = require("./ABOUT");
var _ADMIN_INFO = require("./ADMIN_INFO");
var _CONTACT = require("./CONTACT");
var _PARTNER = require("./PARTNER");
var _PROJECT = require("./PROJECT");
var _PROJECT_IMG = require("./PROJECT_IMG");
var _SERVICE = require("./SERVICE");
var _STACK = require("./STACK");
var _TB_USER = require("./TB_USER");

function initModels(sequelize) {
  var ABOUT = _ABOUT(sequelize, DataTypes);
  var ADMIN_INFO = _ADMIN_INFO(sequelize, DataTypes);
  var CONTACT = _CONTACT(sequelize, DataTypes);
  var PARTNER = _PARTNER(sequelize, DataTypes);
  var PROJECT = _PROJECT(sequelize, DataTypes);
  var PROJECT_IMG = _PROJECT_IMG(sequelize, DataTypes);
  var SERVICE = _SERVICE(sequelize, DataTypes);
  var STACK = _STACK(sequelize, DataTypes);
  var TB_USER = _TB_USER(sequelize, DataTypes);


  return {
    ABOUT,
    ADMIN_INFO,
    CONTACT,
    PARTNER,
    PROJECT,
    PROJECT_IMG,
    SERVICE,
    STACK,
    TB_USER,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
