const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

exports.isAuthenticatedUser = async (req, res, next) => {
  //   console.log("req==>", req);
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  //   console.log("decodedData===>", decodedData);
  req.user = await User.findById(decodedData.id);
  next();
};

exports.authorizeRole =
  (...roles) =>
  async (req, res, next) => {
    // here req.user is comes due to token set re.user dadta in req
    console.log("roles==>", roles); //roles==> [ 'admin' ] due to ...roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role: ${req.user.role} is not allowed to access this resouce `,
      });
    }
    next();
  };
