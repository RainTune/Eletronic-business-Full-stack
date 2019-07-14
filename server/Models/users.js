const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "checked": Number,
      "productNum": Number
    }
  ],
  "addressList": [
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": String,
      "tel" : String,
      "isDefault" : Boolean
    }
  ]
});
module.exports = mongoose.model('User',usersSchema);
