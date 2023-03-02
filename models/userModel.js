const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    maxLength: [30, "User name can not exceed 30 characters"],
    minLength: [4, "User name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // maxLength: [1024, "User name can not exceed 1024 characters"],
    minLength: [8, "Password should have more than 8 characters"],
    select: false,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    maxLength: [10, "Phone number cannot be more than 10 characters"],
    minLength: [10, "Phone name should have 10 characters"],
  },
  street: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  zipcode: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//before saving password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//comparing password  //NOTE:-> return Boolean
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//creating a field and assigning value of another field which already present
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

//JWT Token creater method
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

userSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("user", userSchema);
