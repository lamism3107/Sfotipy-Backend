const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = {
  verifyAccessToken: (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    // console.log("check token", token);

    if (token) {
      //Lấy ra token: VD: Bearer sdfasdfsa => lấy ra sdfasdfsa
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, decoded) => {
        if (err) {
          res.status(403).json({
            success: false,
            message: "Invalid tokennn",
            data: null,
          });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: "You're not authenticateddđ",
        data: null,
      });
    }
  },

  verifyAdmin: (req, res, next) => {
    authMiddleware.verifyAccessToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.role === "admin") {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "You're not allowed to access this",
          data: null,
        });
      }
    });
  },
  verifyArtist: (req, res, next) => {
    authMiddleware.verifyAccessToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.role === "artist") {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "You're not allowed to access this",
          data: null,
        });
      }
    });
  },

  verifyArtistandAdmin: (req, res, next) => {
    authMiddleware.verifyAccessToken =
      (req,
      res,
      () => {
        if (
          req.user.id === req.params.id ||
          req.user.role === "artist" ||
          req.user.role === "admin"
        ) {
          next();
        } else {
          res.status(403).json({
            success: false,
            message: "You're not allowed to access this",
            data: null,
          });
        }
      });
  },
};
module.exports = authMiddleware;
