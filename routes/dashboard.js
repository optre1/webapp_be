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
    let result = await dbInstance.checkCookie(requestToken)
    if (result.result == false) {
      res.json({success: false, message: result.message})
      return
    } else {
      let theCookie = result.message
      let userRecord = await dbInstance.getUserWithId(theCookie.userId)
      //TODO - error hnadling userRecord
      res.json({success: true, message: userRecord});
    }
    
  });

  export default router;