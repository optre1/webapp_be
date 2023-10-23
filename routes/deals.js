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
    res.json({ success: false, message: errors.INVALID_TOKEN })
    return
  }
  let result = await dbInstance.checkCookie(requestToken)
  if (result.result == false) {
    res.json({ success: false, message: result.message })
    return
  }
  const theCookie = result.message
  const queryParams = req.query;
  // Get the number of query parameters
  const numberOfParams = Object.keys(queryParams).length;
  if (numberOfParams == 0) {
    var deals = await dbInstance.getAllDeals()
    res.json({ success: true, message: deals })
    return
  } else {
    var dealIds = queryParams.dealIds.split(',')
    var deals = await dbInstance.getDealsWithIds(dealIds)
    res.json({ success: true, message: deals })
  }

});

router.post('/create', async (req, res) => {
  const { name, value, status } = req.body.dealData;
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
    // Check that value only contains digits
    if (!/^\d+$/.test(value)) {
      res.json({ success: false, message: errors.INVALID_VALUE })
      return
    }

    let result = await dbInstance.createDeal({ "name": name, "value": value, "status": status })
    res.json({ success: result, message: result ? errors.NO_ERR : errors.DB_COM_ERR });
  }
});


router.post('/delete', async (req, res) => {
  const dealIds = req.body.selectedDeals;
  const requestToken = req.cookies.token
  if (!requestToken) {
    res.json({ success: false, message: errors.INVALID_TOKEN })
    return
  }
  let cookieResult = await dbInstance.checkCookie(requestToken)
  if (cookieResult.result == false) {
    res.json({ success: false, message: cookieResult.message })
    return
  }
  let theCookie = cookieResult.message
  if (theCookie) {
    let result = await dbInstance.deleteDeals(dealIds)
    res.json({ success: result, message: errors.NO_ERR });
  }
});

export default router;