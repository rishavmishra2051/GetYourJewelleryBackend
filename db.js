require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

// const mongoDbClient = require("mongodb").MongoClient
//const mongoURI = 'mongodb://getyourfood:rishav123@ac-mviug0q-shard-00-00.eprd7rt.mongodb.net:27017,ac-mviug0q-shard-00-01.eprd7rt.mongodb.net:27017,ac-mviug0q-shard-00-02.eprd7rt.mongodb.net:27017/GetYourFood?ssl=true&replicaSet=atlas-ud8jkn-shard-0&authSource=admin&retryWrites=true&w=majority'
module.exports = function (callback) {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, async (err, result) => {
        // mongoDbClient.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
        if (err) console.log("----" + err)
        else {
            console.log("connected to mongo")
            const foodCollection = await mongoose.connection.db.collection("jewel_items");
            foodCollection.find({}).toArray(async function (err, data) {
                const categoryCollection = await mongoose.connection.db.collection("jewel_categories");
                categoryCollection.find({}).toArray(async function (err, catdata) {
                    const userCollection = await mongoose.connection.db.collection("gyj_users");
                    userCollection.find({}).toArray(async function (err, userdata) {
                        const orderCollection = await mongoose.connection.db.collection("admin_orders");
                        orderCollection.find({}).toArray(async function (err, orderdata) {
                            callback(err, data, catdata, userdata, orderdata);
                        })
                    })
                })
            });
        }
    })
};
