const express = require('express')
const User = require('../models/User')
const GyjOrder = require('../models/GyjOrder')
const Category = require('../models/Category')
const Item = require('../models/Item')
const OrderAdmin = require('../models/OrderAdmin')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const axios = require('axios')
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "MyNameIsRishavMishra"
// var foodItems= require('../index').foodData;
// require("../index")
//Creating a user and storing data to MongoDB Atlas, No Login Requiered
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.json({ success, authToken })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        console.error(error.message)
    }
})

// Authentication a User, No login Required
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Email not registered" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.

        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Incorrect Password" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        if (req.body.email === "getyourjewellery@gmail.com") {
            if (!pwdCompare) {
                return res.status(400).json({ success, error: "Incorrect Password" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            success = 100;
            const authToken = jwt.sign(data, jwtSecret);
            return res.json({ success, authToken })
        }

        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password") // -password will not pick password from db.
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
// Get logged in User details, Login Required.
router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        console.log(lat, long)
        let location = await axios
            //https://api.opencagedata.com/geocode/v1/json?q=
            .get("" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
            .then(async res => {
                // console.log(`statusCode: ${res.status}`)
                console.log(res.data.results)
                // let response = stringify(res)
                // response = await JSON.parse(response)
                let response = res.data.results[0].components;
                console.log(response)
                let { village, county, state_district, state, postcode } = response
                return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
            })
            .catch(error => {
                console.error(error)
            })
        res.send({ location })
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
router.post('/jewelData', async (req, res) => {
    try {
        res.send([global.foodData, global.foodCategory])
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

router.post('/userData', async (req, res) => {
    try {
        // console.log( JSON.stringify(global.foodData))
        // const userId = req.user.id;
        // await database.listCollections({name:"food_items"}).find({});
        //console.log(global.foodCategory)
        res.send(global.userData)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

router.post('/gyjorderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0, 0, { Order_date: req.body.order_date })
    console.log("1231242343242354", req.body.email)

    //if email not exisitng in db then create: else: InsertMany()
    let eId = await GyjOrder.findOne({ 'email': req.body.email })
    //console.log(eId)
    if (eId === null) {
        try {
            //console.log(data)
            //console.log("1231242343242354", req.body.email)
            await GyjOrder.create({
                email: req.body.email,
                order_data: [data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await GyjOrder.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data: data } }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})


router.post('/mygyjOrderData', async (req, res) => {
    try {
        //console.log(req.body.email)
        let eId = await GyjOrder.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({ orderData: eId })
    } catch (error) {
        res.send("Error", error.message)
    }
});

router.post('/orderadmin',
    async (req, res) => {
        let data = req.body.order_data
        await data.splice(0, 0, { Order_date: req.body.order_date })
        try {
            await OrderAdmin.create({
                email: req.body.email,
                order_data: [data],
                order_state: "Placed"
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    });

router.post('/orderstate', async (req, res) => {
    try {
        await OrderAdmin.findOneAndUpdate({
            _id: req.body.id
        },
            { $set: { order_state: req.body.state } }).then(() => {
                res.json({ success: true })
            });

    } catch (error) {
        console.log(error.message)
        res.send("Server Error", error.message)
    }
});

router.post('/fetchgyjOrderData', async (req, res) => {
    try {
        res.json(global.orderData)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
});

router.post('/addcategory', [
    body('CategoryName')
], async (req, res) => {
    let success = false
    try {
        await Category.create({
            CategoryName: req.body.CategoryName,
        }).then(() => {
            success = true
            res.json({ success })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Enter Category for Auth" })
            })
    } catch (error) {
        console.error(error.message)
    }
});

router.post('/updatecategory', async (req, res) => {
    try {
        await Category.findOneAndUpdate({
            CategoryName: req.body.CategoryName
        },
            { $set: { CategoryName : req.body.UpdatedCategoryName } }).then(() => {
                res.json({ success: true })
            });

    } catch (error) {
        console.log(error.message)
        res.send("Server Error", error.message)
    }
});

router.post('/additem', [
    body('CategoryName'), body('name'), body('img'), body('price'), body('Metal'), body('Material'),
    body('Save'), body('Dealer'), body('pricebreakup.*.Gold'), body('pricebreakup.*.Diamond/Stone'),
    body('pricebreakup.*.Making Charges'), body('pricebreakup.*.GST(3%)')
], async (req, res) => {
    let success = false
    try {
        await Item.create({
            CategoryName: req.body.CategoryName,
            name: req.body.name,
            img: req.body.img,
            price: req.body.price,
            Metal: req.body.Metal,
            Material: req.body.Material,
            Save: req.body.Save,
            Dealer: req.body.Dealer,
            pricebreakup: [{
                Gold: req.body.Gold,
                DiamondStone: req.body.DiamondStone,
                MakingCharges: req.body.MakingCharges,
                GST: req.body.GST
            }]
        }).then(() => {
            success = true
            res.json({ success })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Authentication failed Message" })
            })
    } catch (error) {
        console.error(error.message)
    }
});

router.post('/updateitemprice', async (req, res) => {
    console.log(req.body.updatedprice);
    console.log(req.body._id);
    try {
        await Item.findOneAndUpdate({
            _id: req.body._id
        },
            { $set: { price: req.body.updatedprice } }).then(() => {
                res.json({ success: true })
            });

    } catch (error) {
        console.log(error.message)
        res.send("Server Error", error.message)
    }
});



module.exports = router
