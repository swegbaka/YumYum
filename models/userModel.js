const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Type your name!"],
  },
  email: {
    type: String,
    required: [true, "Provide your email!"],
    unique: true,
    lowercase: true,
    //make sure email format is correct
    validate: [validator.isEmail, "Provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Type your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Double check your password"],
    validate: {
      // works on save!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/*pre.() happening between the moment
receive the data and the moment
where it persist to the database
RUn function if password was modified*/

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passowordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 600000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
