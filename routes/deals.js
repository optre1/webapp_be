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
        var deals = await dbInstance.getAllDeals()
        res.json({success: true , message: deals})
        return
      } else {
        var dealIds = queryParams.dealIds.split(',')
        var deals = await dbInstance.getDealsWithIds(dealIds)
        res.json({success: true , message: deals})
      }
      res.json({success: true , message: []})
    }
   
  });

  router.post('/create', async (req, res) => {
    const {name, value, status} = req.body.dealData;
    // Perform authentication logic here
  
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let theCookie = await dbInstance.checkCookie(requestToken)
    let result = false
    if (theCookie) {
      let result = await dbInstance.createDeal({"name": name, "value": value, "status": status})
      res.json({success: result, message: result ? errors.NO_ERR : errors.DB_COM_ERR});
      // Send response back to the client
    }
  });

  router.post('/delete', async (req, res) => {
    const dealIds = req.body.selectedDeals;
    // Perform authentication logic here
  
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let theCookie = await dbInstance.checkCookie(requestToken)
    let result = false
    if (theCookie) {
      let result = await dbInstance.deleteDeals(dealIds)
      res.json({success: result, message: ''});
      // Send response back to the client
    }
  });
  
export default router;