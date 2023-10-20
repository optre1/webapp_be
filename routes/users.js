import express from 'express';
import cookieParser from 'cookie-parser';
import DatabaseWrapper from '../databaseWrapper.js';
import errors from '../errors.js';
const router = express.Router();
const dbInstance = new DatabaseWrapper();

router.use(cookieParser());
router.get('/get', async (req, res) => {
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let theCookie = await dbInstance.checkCookie(requestToken)
    if (theCookie) {
      const queryParams = req.query;
      // Get the number of query parameters
      const numberOfParams = Object.keys(queryParams).length;
      if(numberOfParams==0) {
        var users = await dbInstance.getAllUsers()
        res.json({success: true , message: users})
        return
      } else {
        /*var userIds = queryParams.userIds.split(',')
        var users = await dbInstance.getUsersWithIds(userIds)
        res.json({success: true , message: users})*/
      }
      res.json({success: true , message: []})
    }
  
  });

  router.post('/create', async (req, res) => {
    const {userName, password, isAdmin} = req.body.userData;
    // Perform authentication logic here
  
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let theCookie = await dbInstance.checkCookie(requestToken)
    let result = false
    if (theCookie) {
        let userRecord = await dbInstance.getUserWithId(theCookie.userId)
        if (!userRecord.isAdmin) {
            res.json({success: false, message: errors.ADMIN_RIGHTS_REQUIRED})
            return
        }
      let result = await dbInstance.createUser({"name": userName, "password": password, "isAdmin": isAdmin})
      res.json({success: result, message: result ? errors.NO_ERR : errors.DB_COM_ERR});
      // Send response back to the client
    }
  });

  router.post('/delete', async (req, res) => {
    const userIds = req.body.selectedUsers;
    // Perform authentication logic here
  
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let theCookie = await dbInstance.checkCookie(requestToken)
    let result = false
    if (theCookie) {
        let userRecord = await dbInstance.getUserWithId(theCookie.userId)
        if (!userRecord.isAdmin) {
            res.json({success: false, message: errors.ADMIN_RIGHTS_REQUIRED})
            return
        }
      let result = await dbInstance.deleteUsers(userIds)
      res.json({success: result, message: result? errors.NO_ERR : errors.RECORD_NOT_FOUND});
      // Send response back to the client
    }
  });
export default router;