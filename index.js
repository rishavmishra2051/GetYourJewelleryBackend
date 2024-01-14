//nodemon .\index.js
require('dotenv').config()

global.foodData = require('./db')(function call(err, data, catData, userdata, orderdata) {
  // console.log(data)
  if(err) console.log(err);
  global.foodData = data;
  global.foodCategory = catData;
  global.userData = userdata;
  global.orderData = orderdata;
})

const express = require('express')
const app = express()
const port = process.env.PORT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://6583f9ef7e948fc5bfd02f52--candid-otter-4bf405.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend of Get Your Jewellery')
})

app.use('/api/auth', require('./Routes/Auth'));
//app.use('/api/updateauth', require('./Routes/UpdateAuth'));
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})


