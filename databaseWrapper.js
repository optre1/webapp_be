
import {createRequire} from 'module'
import CryptoJS from 'crypto-js';
const require = createRequire(import.meta.url);
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId;
import errors from './errors.js';
export default class DatabaseWrapper {
  constructor() {
    if (DatabaseWrapper.instance) {
      return DatabaseWrapper.instance;
    }
    // Initialize the database connection here
    DatabaseWrapper.instance = this;
  }

  async authenticate(username, password) {
    try {
      const db = await this.getDB()
      const document =
          await db.collection('login').findOne({'userName': username});
      if (document && document.passwordHash === password) {
        return [true, document];
      } else {
        return [false, null];
      }
    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return [false, null];
    }
  }
  async getUserWithId(uid) {
    try {
      const db = await this.getDB()
      
      const document =
          await db.collection('login').findOne({'_id': new ObjectId(uid)});
          
      return document;

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return null;
    }
  }


  async getAllUsers() {
    const db = await this.getDB()
    let res = db.collection('login').find()
    var items = []
    while (await res.hasNext()){
        const item = await res.next()
        items.push(item)
    }
    return items
  }

  async addCookie(token, uid, validUntil) {
    const db = await this.getDB()
    db.collection('cookies').insertOne(
        {'token': token, 'userId': uid, 'validUntil': validUntil})
  }

  async checkCookie(token) {
    if (!token) {
      return {"result" : false, "message": errors.INVALID_TOKEN}
    }

    const db = await this.getDB()
    if(!db) {
      return {"result": false, "message": errors.DB_COM_ERR}
    }
    const document = await db.collection('cookies').findOne({'token': token})
    if (document && document.validUntil > new Date()) {
      return {"result": true, "message": document}
    } else {
      return {"result": false, "message": errors.INVALID_TOKEN}
    }
  }
  async removeCookie(token, uid) {
    const db = await this.getDB()
    db.collection('cookies').deleteOne({'token': token, 'userId': uid})
  }

  async createTask(task) {
    const db = await this.getDB()
    let res = db.collection('tasks').insertOne(task)
    return res ? true : false
  }
  async getAllTasks() {
    const db = await this.getDB()
    
    let res =  db.collection('tasks').find()
    var items = []
    while (await res.hasNext()){
        const item = await res.next()
        items.push(item)
    }

    return items
  }
  async tasksDelete(tasks) {
    try {
      const db = await this.getDB();
      const result = await db.collection('tasks').deleteMany({
        _id: { $in: tasks.map(taskId => new ObjectId(taskId)) }
      });
      console.log(`${result.deletedCount} tasks deleted`);
      return true
    } catch (err) {
      console.error('Error occurred while deleting tasks:', err);
      return false
    }
  }

  async createDeal(deal){
    const db = await this.getDB()
    let res = await db.collection('deals').insertOne(deal)
    return res ? true : false
  }
  async getDeals() {
    const db = await this.getDB()
    
    let res = await  db.collection('deals').find()
    var items = []
    while (await res.hasNext()){
        const item = await res.next()
        items.push(item)
    }

    return items
  }

  async dealsDelete(deals) {
    try {
      const db = await this.getDB();
      const result = await db.collection('deals').deleteMany({
        _id: { $in: deals.map(dealId => new ObjectId(dealId)) }
      });
      console.log(`${result.deletedCount} deals deleted`);
      return true
    } catch (err) {
      console.error('Error occurred while deleting deals:', err);
      return false
    }
  }
  async getDealsWithIds(dealIds) {
    try {
      const db = await this.getDB()
      const document =
          await db.collection('deals').find({'_id': {$in: dealIds.map(id => new ObjectId(id))}});
      return document;

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return null;
    }
  }

  async getDealWithId(dealId) {
    try {
      const db = await this.getDB()
      const document =
          await db.collection('deals').findOne({'_id': new ObjectId(dealId)});
      return document;

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return null;
    }
  }
  async getAllDeals() {
    const db = await this.getDB()
    
    let res =  db.collection('deals').find()
    var items = []
    while (await res.hasNext()){
        const item = await res.next()
        items.push(item)
    }
    return items
  }

  async updateDeal(dealId, deal) {
    try {
      const db = await this.getDB()
      const document =
          await db.collection('deals').updateOne({'_id': new ObjectId(dealId)}, {$set: deal});
      return document;

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return null;
    }
  }
  async getTasksForDeal(dealId) {
    try {
      const db = await this.getDB()
      const document =
          await db.collection('tasks').find({'dealId': dealId});
      return document;

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return null;
    }
  }

  async deleteDeals(dealIds) {
    try {
      const db = await this.getDB();
      const result = await db.collection('deals').deleteMany({
        _id: { $in: dealIds.map(dealId => new ObjectId(dealId)) }
      });
      console.log(`${result.deletedCount} deals deleted`);
      return true
    } catch (err) {
      console.error('Error occurred while deleting deals:', err);
      return false
    }
  }

  async getTasksForUser(userId) {
    try {
      const db = await this.getDB()
      const document =
          await db.collection('tasks').find({'assignee': userId});
      return document;

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return null;
    }
  }

  async createUser(user) {
    try{
      const db = await this.getDB()
      let res = await db.collection('login').insertOne({ "userName": user.name,
      "passwordHash": user.password,
      "builtIn": false,
      "isAdmin": user.isAdmin})
      return res ? true : false
    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
      return false;
    }
  } 

  async deleteUsers(userIds) {
    try {
      const db = await this.getDB();
      //Search for built in users
      const records = await db.collection('login').find({'_id': {$in: userIds.map(id => new ObjectId(id))}});
      const builtInUsers = []
      while (await records.hasNext()){
        const record = await records.next()
        if (record.builtIn) {
          builtInUsers.push(record)
        }
      }
      if (builtInUsers.length > 0) {
        //Cannot delete built in users
        return false
      }
      //Delete non built in users
      const result = await db.collection('login').deleteMany({
        _id: { $in: userIds.map(userId => new ObjectId(userId)) }
      });
      console.log(`${result.deletedCount} users deleted`);
      return true
    } catch (err) {
      console.error('Error occurred while deleting users:', err);
      return false
    }
  }

  async getDB() {
   
      if (this.client==null){
       await this.connect()
      }
      const db = this.client.db('app');
      
      return db

  }
  async connect() {
    try {
      const url = 'mongodb://localhost:27017';
      const dbName = 'app';
      this.client = await mongo.connect(url, { useUnifiedTopology: true });
      const db = this.client.db(dbName);
      const collections = await db.collections();
      if (collections.length === 0) {
        await db.createCollection('login');
        this.createUser({"name": "root", "password" : CryptoJS.SHA256("P@ssw0rd").toString(CryptoJS.enc.Hex), "isAdmin": true, "builtIn": true})
        await db.createCollection('cookies');
        await db.createCollection('tasks');
        await db.createCollection('deals');
      }
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
    }
  }


}
