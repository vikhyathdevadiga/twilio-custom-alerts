import { engine, thresholdRule } from './ruleEngine.js';
import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { sendEmailAlert } from './sendEmail.js'

const mongodbDatabase = process.env.MONGO_DB_DATABASE
const mongodbCollection = process.env.MONGO_DB_COLLECTION
const uri = process.env.MONGO_DB_URI
const mongoClient = new MongoClient(uri)
await mongoClient.connect();
const db = mongoClient.db(mongodbDatabase);
const collection = db.collection(mongodbCollection);

const alertMiddleware = async (req, res, next) => {
    const mainJSON = req.body;
    mainJSON.Payload = JSON.parse(req.body.Payload);
    await validateRules(mainJSON);
    next();
};

async function validateRules(data) {
    const docArray = await collection.find({}).toArray();
    engine.addFact('webhookData', data);
    const { events } = await engine.run();
    for (const event of events) {
        const message = event.params.data;
        const eventType = event.type;
        var item = docArray.find(item => item[eventType]);
        var diff = item ? new Date(message.Timestamp).getTime() - item[eventType].lastUpdatedTime : 0;
        if (!item) {
            item = {
                [eventType]: {
                    count: 1,
                    lastUpdatedTime: new Date(message.Timestamp).getTime()
                }
            };
            docArray.push(item);
            await collection.insertOne(item);
        } else if (diff > thresholdRule[eventType].threshold) {
            item[eventType].count = 1;
            diff = thresholdRule[eventType].threshold;
            item[eventType].lastUpdatedTime = new Date(message.Timestamp).getTime();
            await updateItem(item, eventType);
        } else {
            item[eventType].count++;
            item[eventType].lastUpdatedTime = new Date(message.Timestamp).getTime();
            await updateItem(item, eventType);
        }
        console.log(item[eventType])
        if (item[eventType].count === thresholdRule[eventType].count && diff <= thresholdRule[eventType].threshold) {
            console.log("Threshold Reached!");
            sendEmailAlert(event.params.message, message);
        }
    }
}

async function updateItem(item, eventType) {
    const filter = { _id: item._id };
    const updateDoc = {
        $set: {
            [`${eventType}.count`]: item[eventType].count,
            [`${eventType}.lastUpdatedTime`]: item[eventType].lastUpdatedTime
        }
    };
    await collection.updateOne(filter, updateDoc);
}
export { alertMiddleware };