const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logoutGG", authController.logoutGG);

//Flow: Khi login bằng google account => Đăng nhập thành công => return userCred => Check firebase auth token (headers: {authorization: bearer ${userCred.getIdToken}})
// => check user_id, nếu tồn tại trong db thì sẽ sửa auth_time, ngược lại thì sẽ tạo mới user
router.get("/loginWithGoogle", authController.loginWithGoogle);

//REFRESH TOKEN
router.post("/refreshToken", authController.requestRefreshToken);
router.post("/logout", authMiddleware.verifyAccessToken, authController.logout);

module.exports = router;

{
  // "presets": ["next/babel"],
  // "plugins": [],
  // "loaders": [
  //   { "test": "/.js$/", "exclude": "/node_modules/", "loader": "babel" }
  // ]
}
