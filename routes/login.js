import express from 'express';
import cookieParser from 'cookie-parser';
import DatabaseWrapper from '../databaseWrapper.js';
import CryptoJS from 'crypto-js';
import errors from '../errors.js';

const router = express.Router();
const dbInstance = new DatabaseWrapper();

router.use(cookieParser());

router.get('/loginWithCookie', async (req, res) => {
  const requestToken = req.cookies.token;
  if (!requestToken) {
    res.json({ success: false, message: errors.INVALID_TOKEN });
    return;
  }
  let result = await dbInstance.checkCookie(requestToken);
  if (result.result == false) {
    res.json({ success: false, message: result.message });
    return;
  }
  let theCookie = result.message;
  let date = new Date();
  if (theCookie && theCookie.validUntil > date) {
    res.json({ success: true, message: errors.NO_ERR });
  } else {
    if (theCookie) {
      dbInstance.removeCookie(requestToken);
    }
    res.json({ success: false, message: errors.INVALID_TOKEN });
  }
});
router.get('/logout', async (req, res) => {
  const requestToken = req.cookies.token
  if (!requestToken) {
    res.json({ success: false, message: errors.INVALID_TOKEN })
    return
  }
  let result = await dbInstance.checkCookie(requestToken)
  if (result.result == false) {
    res.json({ success: false, message: result.message })
    return
  }

  let theCookie = result.message
  if (theCookie) {
    await dbInstance.removeCookie(theCookie.token, theCookie.userId)
    res.json({ success: true, message: errors.NO_ERR });
  }
  else {
    res.json({ success: false, message: errors.INVALID_TOKEN })
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let result = await dbInstance.authenticate(username, password)
  if (result[0] == true) {
    let date = new Date()
    const token = CryptoJS.SHA256(username + password + new Date())
      .toString(CryptoJS.enc.Hex);
    date.setHours(date.getHours() + 1)
    // Set the token in a cookie that expires in 1 hour
    await dbInstance.addCookie(token, result[1]._id.toString(), date)
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
  }
  res.json({ success: result[0], message: result[1] });
});
export default router;