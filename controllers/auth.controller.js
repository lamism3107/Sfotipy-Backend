const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const admin = require("../config/firebase/firebase.config");
const { genAccessToken, genRefreshToken } = require("../utils/jwt");
const userController = require("./user.controller");
const jwt = require("jsonwebtoken");
dotenv.config();

const sessionPersist = async (req, res) => {
  const id = req.body.userId;
  try {
    const user = await User.findById(id);
    return res.status(200).json({
      success: true,
      message: "session persist successfully!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
const register = async (req, res) => {
  const { email, password, name, gender } = req.body;

  try {
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "This email is already taken!",
        data: null,
      });
    } else {
      const hashPassword = bcrypt.hashSync(req.body.password, 10);

      const newUser = await User.create({
        email: email,
        name: name,
        password: hashPassword,
        gender: gender,
        role: "listener",
      });

      //Trả về userData mà ko truyền vào password
      const { password, ...userDataReturned } = newUser._doc;
      return res.status(201).json({
        success: true,
        message: "Registers successfully",
        data: userDataReturned,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const login = async (req, res) => {
  //Step 1: Client send request to access resources protected by server. If a client is not authenticated, server responses with error status 401 Authorization. => Client must sent username and password to server
  //Step2: Check if user's email already exists
  //Step3: if user's email doesn't exist, check password
  //Step4: If password is correct, create AT and RT then return these to client
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist",
        data: null,
      });
    } else {
      const isValidPassword = bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(404).json({
          success: false,
          message: "Password is incorrect",
        });
      } else {
        const payload = {
          id: user._id,
          role: user.role,
        };
        const accessToken = await genAccessToken(payload);
        const newRefreshToken = await genRefreshToken(payload);

        res.cookie("refreshToken", newRefreshToken, {
          //maxAge: 30s
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

        //Lưu refreshToken vào database
        const refreshTokenArray = await User.findOne(
          { email: email },
          {
            _id: 0,
            refreshToken: 1,
          }
        );
        refreshTokenArray.refreshToken.push(newRefreshToken);
        await User.updateOne(
          { email: email },
          {
            refreshToken: refreshTokenArray.refreshToken,
          },
          {
            returnDocument: "after",
          }
        );

        const updatedUser = await User.findOne({ email: email });

        //Trả về res.data thông tin về user(không chứa mật khẩu và kèm thêm accessToken)
        const { password, refreshToken, ...dataToReturn } = updatedUser._doc;
        dataToReturn.accessToken = accessToken;
        return res.status(200).json({
          success: true,
          message: "Login successfully!",
          data: dataToReturn,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const loginWithGoogle = async (req, res) => {
  //Check postman api (http://localhost:8000/api/users/login)
  //pass to headers: key: Authorization , value: Bearer: Firebase Auth token when login
  if (!req.headers.authorization) {
    return res.status(500).json({ message: "Invalid Token google" });
  }

  //Get Firebase Auth token when login with google account
  const AccessToken = req.headers.authorization.split(" ")[1];

  try {
    //Decode token
    const decodeValue = await admin.auth().verifyIdToken(AccessToken);

    if (!decodeValue) {
      return res.status(500).json({ message: "Unauthorized" });
    } else {
      //Checking if user exist
      const userExist = await User.findOne({ email: decodeValue.email });
      if (!userExist) {
        userController.createNewUserByGoogleAccount(decodeValue, req, res);
      } else {
        userController.updateGoogleAccountUser(decodeValue, req, res);
      }
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `ERROR: ${e}`,
      data: null,
    });
  }
};

const requestRefreshToken = async (req, res) => {
  //Lấy refreshToken từ Cookies
  const refreshToken = req.cookies.refreshToken;
  const currentUserId = req.body.userId;
  //Kiểm tra xem refreshToken có tồn tại hay không, nếu không tức là chưa xác thực
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "You're not authenticated",
      data: null,
    });
  }
  let refreshTokenArray = await User.findOne(
    { _id: currentUserId },
    { _id: 0, refreshToken: 1 }
  );
  //Check xem refresh token có phải của chính user không
  if (!refreshTokenArray.refreshToken.includes(refreshToken)) {
    return res.status(403).json({
      success: false,
      message: "Refresh token is not valid",
      data: null,
    });
  }

  //Có được refreshToken rồi thì kiểm tra refreshToken có chính xác hay không,
  //Nếu refreshToken chính xác thì lấy ra payload và tạo ra newAccessToken và newRefreshToken mới
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_KEY,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Cannot verify refresh token",
          data: null,
        });
      }

      //Trả về mảng refreshToken mới mà không chứa refreshToken đang verify
      refreshTokenArray = refreshTokenArray.refreshToken.filter(
        (token) => token !== refreshToken
      );
      //Create new access token và refresh token
      const payload = {
        id: decoded.id,
        role: decoded.role,
      };
      const newAccessToken = await genAccessToken(payload);
      const newRefreshToken = await genRefreshToken(payload);

      refreshTokenArray.push(newRefreshToken);
      //Sửa lại mảng refreshToken trong DB

      await User.updateOne(
        { _id: currentUserId },
        {
          refreshToken: refreshTokenArray,
        },
        {
          returnDocument: "after",
        }
      );

      //Lưu newRefreshToken vào cookies
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      //Trả về response
      return res.status(200).json({
        success: true,
        message: "Refresh token successfully",
        data: {
          accessToken: newAccessToken,
        },
      });
    }
  );
};

const logout = async (req, res) => {
  //Logout => Xoá hết token
  let refreshToken = req.cookies.refreshToken;
  console.log("check refresh token", refreshToken);
  const id = req.body.id;

  try {
    //Xoá  refreshToken trong DB

    let refreshTokenArray = await User.findOne(
      { _id: id },
      { _id: 0, refreshToken: 1 }
    );
    refreshTokenArray = refreshTokenArray.refreshToken.filter(
      (token) => token !== refreshToken
    );
    console.log("check change", refreshTokenArray);

    await User.updateOne(
      { _id: id },
      {
        refreshToken: refreshTokenArray,
      },
      {
        returnDocument: "after",
      }
    );
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successfully!",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const logoutGG = async (req, res) => {
  res.clearCookie("refreshToken");
  const id = req.body.id;
  try {
    //Xoá  refreshToken trong DB
    let refreshTokenArray = await User.findOne(
      { _id: id },
      { _id: 0, refreshToken: 1 }
    );
    refreshTokenArray = refreshTokenArray.refreshToken.filter(
      (token) => token !== req.cookies.refreshToken
    );

    await User.updateOne(
      { _id: id },
      {
        refreshToken: refreshTokenArray,
      },
      {
        returnDocument: "after",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Logout successfully!",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
module.exports = {
  register,
  login,
  loginWithGoogle,
  requestRefreshToken,
  logout,
  logoutGG,
  sessionPersist,
  // verify,
  // refreshToken,
};
