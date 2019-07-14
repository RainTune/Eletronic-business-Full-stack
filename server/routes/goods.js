const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const goods = require(path.join(__dirname,'../Models/goods.js'));

/*连接数据库*/
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected',function () {
  console.log("Mongodb connected success!")
});
mongoose.connection.on('error',function () {
  console.log("Mongdb connected error!")
});
mongoose.connection.on('disconnected',function () {
  console.log("Mongdb disconnected!")
});

/*请求产品数据*/
router.get('/list',function (req,res,next) {
  //res.send('goodsList')
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));

  let skip = (page - 1) * pageSize;
  /*注意：sort若是为1的话，升序，-1为降序*/
  let sort = req.param('sort');
  let params = {};

  if(req.param('startPrice')&&req.param('endPrice')){
    let startPrice = parseInt(req.param('startPrice'));
    let endPrice = parseInt(req.param('endPrice'));
    params = {
     'salePrice': {
       $gt: startPrice,
       $lte: endPrice
     }
    }
  }

  let goodsModel = goods.find(params).skip(skip).limit(pageSize);
  if(sort){
    goodsModel.sort({'salePrice':sort});
  }
  goodsModel.exec(function (err,doc) {
    if(err) {
      res.json({
        status: 0,
        msg: err.message
      })
    }else {
      res.json({
        status: 1,
        msg: 'OK',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
});

/*添加购物车*/
router.post('/addCart',function (req,res,next) {
  var userName = req.cookies.userName;
  var productId = req.body.productId;
  /*连接数据表*/
  const User = require("../Models/users.js");
  User.findOne({userName:userName},function (err,user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message
      })
    }else{
      if(user) {
        /*先确定购物车里面是否有这个商品*/
        let goodsItem = '';
        user.cartList.forEach(function (item) {
          if(item.productId == productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        if(goodsItem){
          user.save(function (err2) {
            if(err2) {
              res.json({
                status: '0',
                msg: err2.message
              })
            }else{
              res.json({
                status: '1',
                msg: 'OK',
                result: 'success'
              })
            }
          });
        }else{
          goods.findOne({productId:productId},function (err1,doc) {
            if(err1) {
              res.json({
                status: '0',
                msg: err1.message
              })
            }else{
              if(doc) {
                doc.productNum = 1;
                doc.checked = 1;
                user.save(function (err2) {
                  if(err2) {
                    res.json({
                      status: '0',
                      msg: err2.message
                    })
                  }else{
                    res.json({
                      status: '1',
                      msg: 'OK',
                      result: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }

  })
});

function getData(obj,factor) {
  return new Promise((resolve,reject)=> {
    obj.findOne(factor,function (err,data) {
      if(err) {
        reject(err)
      }else {
        resolve(data);
      }
    })
  })
}
function saveData(obj) {
  return new Promise((resolve,reject)=> {
    obj.save(function (err,data) {
      if(err) {
        reject(err)
      }else {
        resolve(data);
      }
    })
  })
}
module.exports = router;
