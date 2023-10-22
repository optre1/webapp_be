import express from 'express';
import cookieParser from 'cookie-parser';
import DatabaseWrapper from '../databaseWrapper.js';
import errors from '../errors.js';
const router = express.Router();
const dbInstance = new DatabaseWrapper();

router.use(cookieParser());

router.post('/create', async (req, res) => {
    const {name, description, dealId, assignee, priority, dueDate, status} = req.body.taskData;
    // Perform authentication logic here
  
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let result = await dbInstance.checkCookie(requestToken)
    if (result.result == false) {
      res.json({success: false, message: result.message})
      return
    }

    let theCookie = result.message
    if (theCookie) {
      let userRecord = await dbInstance.getUserWithId(theCookie.userId)
      let uid = userRecord._id.toString()
      let newTask = {
        'name': name,
        'description': description,
        'dealId': dealId,
        'assignee': assignee,
        'status': status,
        'priority': priority,
        'dueDate': dueDate,
        'owner': uid
      }
  
      let result = await dbInstance.createTask(newTask)
      res.json({success: result, message: result ? errors.NO_ERR : errors.DB_COM_ERR});
      // Send response back to the client
    }
  
    
  });
  
  router.get('/get', async (req, res) => {
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let result = await dbInstance.checkCookie(requestToken)
    if (result.result == false) {
      res.json({success: false, message: result.message})
      return
    }

    let theCookie = result.message
    if (theCookie) {
      const queryParams = req.query;
      // Get the number of query parameters
      const numberOfParams = Object.keys(queryParams).length;
      if(numberOfParams==0) {
        var tasks = await dbInstance.getAllTasks()
        var users = await dbInstance.getAllUsers()
        var deals = await dbInstance.getAllDeals()
        var results = []
        tasks.forEach((task) => {
            const taskData = { ...task };
            const dealId = taskData.dealId;
            const assignee = taskData.assignee;
            const ownerId = taskData.owner;
            const deal = deals.find((deal) => deal._id.toString() === dealId);
            const owner = users.find((user) => user._id.toString() === ownerId);
            const assigneeUser = users.find((user) => user._id.toString() === assignee);
            taskData.dealName = deal ? deal.name : '';
            taskData.ownerName = owner ? owner.name : '';
            taskData.assigneeName = assigneeUser? assigneeUser.userName : '';
            results.push(taskData);
          });
        if (results.length > 0) {
          res.json({success: true , message: results})
          return
        } else {
            res.json({success: false , message: errors.RECORD_NOT_FOUND})
            return  
        }
       
      } else {
        //TBD
      }
      res.json({success: true , message: errors.NO_ERR})
    }
   
  });
  
  router.post('/delete', async (req, res) => {
    const requestToken = req.cookies.token
    if (!requestToken) {
      res.json({success: false, message: errors.INVALID_TOKEN})
      return
    }
    let result = await dbInstance.checkCookie(requestToken)
    if (result.result == false) {
      res.json({success: false, message: result.message})
      return
    }

    let theCookie = result.message
    if (theCookie) {
      const tasks = req.body.selectedTasks
      const result = dbInstance.tasksDelete(tasks)
      res.json({success: result , message: result ? errors.NO_ERR : errors.RECORD_NOT_FOUND})
    }});

    export default router;