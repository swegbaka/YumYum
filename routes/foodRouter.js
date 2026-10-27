const express = require("express");
const FoodController = require("../controllers/foodController");
const authController = require("../controllers/autheController");

const beefRouter = express.Router();

// beefRouter.route("/").get(authController.protect, beeFController.getAPI);
beefRouter.route("/").get(FoodController.getAPI);

module.exports = beefRouter;
