const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    CategoryName: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    Metal: {
        type: String,
        required: true
    },
    Material: {
        type: String,
        required: true
    },
    Save: {
        type: String,
        required: true
    },
    Dealer: {
        type: String,
        required: true
    },
    pricebreakup: {
        type: [{
            'Gold': String,
            'DiamondStone': String,
            'MakingCharges': String,
            'GST': String
        }],
        required: false
    }
});

module.exports = mongoose.model('jewel_item', ItemSchema);
