import express from 'express';
import cookieParser from 'cookie-parser';
import DatabaseWrapper from '../databaseWrapper.js';
import errors from '../errors.js';

const router = express.Router();
const dbInstance = new DatabaseWrapper();

router.use(cookieParser());
router.get('/', async (req, res) => {
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let theCookie = await dbInstance.checkCookie(requestToken)
    if (theCookie) {
      let userRecord = await dbInstance.getUserWithId(theCookie.userId)
      
      res.json({success: true, message: userRecord});
    }
    else {
      res.json({success: false, message: errors.INVALID_TOKEN})
    }
  });

  export default router;