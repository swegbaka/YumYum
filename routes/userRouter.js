const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/autheController");

const userRouter = express.Router();

userRouter.use(express.json());
userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);

userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);

userRouter.patch("/updatePassword", authController.updatePassword);

userRouter.patch("/updateMe", userController.updateMe);
userRouter.delete("/deleteMe", userController.deleteMe);

userRouter
  .route("/")
  .get(userController.getAllusers)
  .post(userController.createusers);

userRouter
  .route("/:id")
  .get(userController.getusers)
  .delete(userController.deleteusers);

module.exports = userRouter;
