const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// >>>> JWT AUTHENTICATION/AUTHORIZATION FLOW <<<<<

//Step 1: Client send request to access resources protected by server. If a client is not authenticated, server responses with error status 401 Authorization. => Client must sent username and password to server
//Step 2: Server verify authentication/authorization info with the info from user'database. If the auth info is correct, server create AcccessToken and RefreshToken contains the payload having userId (or the identification fields). AccessToken has short expiration date (about 5 minutes). RefreshToken has longer expiration date (about 1 year). RefreshToken must be stored in server side/database.
//Step 3: After creating 2 token, server return access token and refresh token to client.
//Step 4: Client stores AccessToken and RefreshToken in application memory (cookie/local storage).
//Step 5: For those next requests, client sends request with access token atttached to headers
//Step 6: Server receives request then verifies accessToken with the secretKey. If accessToken is valid, server grants access to resource for clients
//Step 7: When accessToken is expired, client sends request with refresh token to server to get new AccessToken.
//Step 8: Server receives request, check if RefreshToken is exists in DB. If exists, server deletes this RefreshToken from DB and create new RefreshToken with the same expiration date and store is in DB(Example: the old RefreshToken expiration date is 05/10/2024 then new new RefreshToken expiration date must be 05/10/2024 too). After creating new RefreshToken, serer creates new AccessToken.
//Step 9: Server return new AccessToken and RefreshToken to Client
//Step 10: Client stores new AccessToken and RefreshToken in application memory (cookie/local storage).
//Step 11: Client can make subsequent requests with new AccessToken (the token refreshing is processed in background so client will not be logout out during the process)
//Step 12: When user want to log out, then call API logout, server will delete RefreshToken in Database, and clear the access token and refresh token from the application memory simultanously
//Step 13: When RefreshToken is expired or invalid, server refuses request from client, client delete AccessToken and RefreshToken from application memory and turn into to logout status

//Lưu token ở đâu?
//1. LOCAL STORAGE:
// - Dễ bị tấn công XSS => Không bảo mật
//2. COOKIES:
// - Config cookie: HTTPOnly
// - Tuy nhiên vẫn có thể bị tấn công CSRF => Khắc phục bằng cách Config cookie: Samesite
// - An toàn hơn LOCAL STORAGE nhưng vẫn có thể bị tấn công và lấy cắp cookie
//3. REDUX STORE kết hợp HTTPOnly COOKIES
// - Sử dụng REDUX STORE để lưu ACCESS TOKEN
// - HTTPOnly COOKIES để lưu REFRESH TOKEN
// => An toàn và bảo mật nhất.

const genAccessToken = async (payload) => {
  //jwt.sign(payload, secretKey, { expiresIn: expiresIn})

  const accessToken = process.env.JWT_ACCESS_KEY;
  const expiresIn = process.env.ACCESS_EXPIRES_IN;
  let token = null;
  try {
    token = jwt.sign(payload, accessToken, { expiresIn: expiresIn });
  } catch (err) {
    console.log("access token error:" + err.message);
  }
  return token;
};

const genRefreshToken = async (payload) => {
  //jwt.sign(payload, secretKey, { expiresIn: expiresIn})

  const refreshToken = process.env.JWT_REFRESH_KEY;
  const expiresIn = process.env.REFRESH_EXPIRES_IN;
  let token = null;
  try {
    token = jwt.sign(payload, refreshToken, { expiresIn: expiresIn });
  } catch (err) {
    console.log("refresh token error:" + err.message);
  }
  return token;
};

module.exports = { genAccessToken, genRefreshToken };
