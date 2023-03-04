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
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//before saving password   but not work when you try update functionality for that we follow findOneAndUpdate event
//which we get below of this event
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//here findOneAndUpdate event is used to fire  findOneAndUpdate after
userSchema.pre("findOneAndUpdate", async function (next) {
  let update = { ...this.getUpdate() }; //get all passed data in body
  if (update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 10); //here  this._update  is used to update password
  }
  next();
});

// userSchema.pre("findOneAndUpdate", async function (next) {
//   console.log("===findOneAndUpdate model===");
//   let update = { ...this.getUpdate() };
//   console.log("update===", update);
//   // Only run this function if password was modified
//   if (update.password) {
//     console.log("===update.password===");
//     console.log("this.password===", update.password);
//     update.password = await bcrypt.hash(this.getUpdate().password, 10);
//     // this.password = await bcrypt.hash(this.password, 10);
//     this._update.password = update.password;
//     this.password = update.password;
//     console.log("this.password===1", update.password);
//     console.log("this.password===2", this._update.password);
//     this.setUpdate(update);
//     console.log("this.password===2", this.password);
//     next();
//   }
//   // next();
// });

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

module.exports = mongoose.model("User", userSchema);
