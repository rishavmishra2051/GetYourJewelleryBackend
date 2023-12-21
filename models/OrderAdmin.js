const mongoose = require('mongoose')

const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    order_data: {
        type: Array,
        required: true,
    },
    order_state: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('admin_order', OrderSchema)
/*
customer_email: {
        type: String,
        required: true,
        unique: true
    },
    orderdate: {
        type: String,
        required: true,
    },
    prod_id: {
        type: String,
        required: true,
    },
    prod_name: {
        type: String,
        required: true,
    },
    prod_img: {
        type: String,
        required: true,
    },
    qty: {
        type: String,
        required: true,
    },
    prod_category: {
        type: String,
        required: true,
    },
    prod_dealer: {
        type: String,
        required: true,
    },
    prod_price: {
        type: String,
        required: true,
    }
*/