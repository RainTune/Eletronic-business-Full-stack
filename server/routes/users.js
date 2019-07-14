var express = require('express');
var router = express.Router();
var md5 = require('md5');

const User = require('../Models/users.js');
/* GET users listing. */
/*用户登录*/
router.post('/login', function(req, res, next) {
  var param = {
      userName: req.body.userName,
      userPwd: md5(md5(req.body.password))
  };
  User.findOne(param,function (err,doc) {
    if(err){
      res.json({
        status: '0',
        msg: err.message
      })
    }
    else{
      if(doc){
        res.cookie('userName',doc.userName,{
          path: '/',
          /*定义cookie存储期限*/
          maxAge: 1000*60*60
        });
        /*登录以后获取购物车商品数量*/
        let n = 0;
        doc.cartList.forEach(item => {
          n += item.productNum;
        });
        /*----------------*/
        res.json({
          status: '1',
          msg: 'OK',
          result: {
            userName: doc.userName,
            cartCountNum: n
          }
        })
      }
      else{
        res.json({
          status: '2',
          msg: 'fail'
        })
      }
    }
  })
});

/*用户注册*/
router.post('/register', function(req, res, next) {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  userPwd = md5(md5(userPwd));
  console.log(req.body);
  User.findOne({
    userName: userName
  },function (err, user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    }else {
      if(user) {
        res.json({
          status: '2',
          msg: '用户名已存在',
          result: ''
        })
      }else {
        new User({
          userId: new Date().getTime(),
          userName: userName,
          userPwd: userPwd,
          orderList: [],
          cartList: [],
          addressList: []
        }).save(function (err) {
          if(err) {
              res.json({
                status: '0',
                msg: err.message,
                result: ''
              })
            }
          else {
            res.cookie('userName', userName, {
              path: '/',
              /*定义cookie存储期限*/
              maxAge: 1000 * 60 * 60
            });
            res.json({
              status: '1',
              msg: '注册成功',
              result: {
                userName: userName
              }
            });
          }
        })
      }
    }
  })
});

/*用户退出*/
router.post('/logout',function (req, res, next) {
  res.cookie('userName','',{
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '1',
    msg:'OK',
    result:''
  })
});

/*检查用户是否登录过*/
router.get('/checkout',function (req, res, next) {
  console.log('hahah');
  if(req.cookies.userName) {
    res.json({
      status: '1',
      msg:'',
      result: req.cookies.userName
    })
  }else {
    res.json({
      status: '0',
      msg: '用户未登录！！！',
      result: ''
    });
  }
});

/*获取购物车列表*/
router.get('/cartList',function(req, res, next) {
  let userName = req.cookies.userName;
  User.findOne({
    userName: userName
  },function (err,doc) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result:''
      })
    }else{
      if(doc) {
        res.json({
          status: '1',
          msg: 'OK',
          result: doc.cartList
        })
      }
    }
  })
});

/*删除购物车数据*/
router.post('/cartDel',function (req, res, next) {
  let userName = req.cookies.userName;
  let productId = req.body.productId;
  User.update({
    userName: userName,
  },{
    $pull:{
      cartList: {
        productId: productId
      }
    }
  },function (err) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result:''
      })
    }else{
      res.json({
        status: '1',
        msg: 'OK',
        result: ''
      })
    }
  })
});

/*更新购物车数据*/
router.post('/cartEdit',function (req, res, next) {
  let userName = req.cookies.userName,
      productId = req.body.productId,
      checked = req.body.checked,
      productNum = req.body.productNum;
  User.update({
    userName: userName,
    "cartList.productId": productId
  },{
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  },function (err) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result:''
      })
    }else{
      res.json({
        status: '1',
        msg: 'OK',
        result: ''
      })
    }
  })
});

/*全选和取消全选的数据更新*/
router.post('/checkAll',function (req, res, next) {
  let userName = req.cookies.userName;
  let checkAll = (req.body.checkAll === true ? 1 : 0);
  User.findOne({userName: userName},function (err, user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result:''
      })
    }else {
      if(user) {
        user.cartList.forEach(item => {
          item.checked = checkAll;
        });
        user.save(function (err2, doc) {
          if(err2){
            res.json({
              status: '0',
              msg: err2.message,
              result:''
            })
          }else {
            res.json({
              status: '1',
              msg: 'OK',
              result:''
            });
          }
        })
      }
    }
  })
});

/*获取地址列表*/
router.get('/addressList',function (req, res, next) {
  let userName = req.cookies.userName;
  User.findOne({userName: userName},function (err, user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      });
    }else {
      if(user) {
        res.json({
          status: '1',
          msg: 'OK',
          result: user.addressList.length===0?[]:user.addressList
        })
      }
    }
  })
});

/*设置默认地址*/
router.post('/setDefault',function (req, res, next) {
  let userName = req.cookies.userName;
  let addressId = req.body.addressId;
  User.findOne({userName: userName}, function (err, user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      });
    }else{
      if(user) {
        user.addressList.forEach(item => {
          item.isDefault = item.addressId === addressId;
        });
        user.save(function (err2, doc) {
          if(err2) {
            res.json({
              status: '0',
              msg: err.message,
              result: ''
            });
          }else {
            res.json({
              status: '1',
              msg: 'OK',
              result: ''
            })
          }
        })
      }
    }
  })


});

/*删除地址*/
router.post('/delAddress',function (req, res, next) {
  let userName = req.cookies.userName;
  let addressId = req.body.addressId;
  User.update({
    userName: userName,
  },{
    $pull:{
      addressList: {
        addressId: addressId
      }
    }
  },function (err) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result:''
      })
    }else{
      res.json({
        status: '1',
        msg: 'OK',
        result: ''
      })
    }
  })
});

/*创建订单*/
router.post('/payMent',function (req, res, next) {
  let userName = req.cookies.userName,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;

      User.findOne({userName: userName},function (err, user) {
        if(err){
          res.json({
            status: '0',
            msg: err.message,
            result:''
          });
        }else {
          if(user) {
            /*获取地址信息*/
            let address = user.addressList.filter(item => {
              return item.addressId === addressId;
            });
            /*获取用户商品数据*/
            let goodList = user.cartList.filter(item => {
              return item.checked === 1;
            });
            /*生成订单号和创建日期*/
            let base = '622';
            var r1 = Math.floor(Math.random()*10);
            var r2 = Math.floor(Math.random()*10);
            var orderId = base + r1 + new Date().getTime() + r2;
            var createDate = new Date().toLocaleString();
            let order = {
              orderId: orderId,
              orderDate: createDate,
              orderTotal: orderTotal,
              addressInfo: address,
              goodsInfo: goodList,
              orderStatus: 1
            };

            user.orderList.push(order);
            user.save(function (err1, doc) {
              if(err1) {
                res.json({
                  status: '0',
                  msg: err1.message,
                  result:''
                });
              }else {
                res.json({
                  status: '1',
                  msg: 'OK',
                  result: {
                    orderId: order.orderId,
                    orderTotal: order.orderTotal
                  }
                })
              }
            })
          }
        }
      })
});

/*获取订单号*/
router.get('/orderSuccess',function (req, res, next) {
  let userName = req.cookies.userName,
      orderId = req.query.orderId;
  User.findOne({
    userName: userName
  },function (err, user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    }else {
      if(user) {
        let orderTotal;
        user.orderList.forEach(item => {
          if(item.orderId   === orderId) {
            orderTotal = item.orderTotal
          }
        });
        console.log(orderTotal);
        res.json({
          status: '1',
          msg: 'ok',
          result: {
            orderId: orderId,
            orderTotal: orderTotal
          }
        })
      }else {
        res.json({
          status: '2',
          msg: '无此订单',
          result: ''
        })
      }
    }
  })
});

router.get('/getCartCount',function (req, res, next) {
  console.log(req.cookies.userName);
  if(req.cookies.userName) {
    let userName = req.cookies.userName;
    User.findOne({
      userName: userName
    },function (err, user) {
      if(err) {
        res.json({
          status: '0',
          msg: err.message,
          result: ''
        })
      }else {
        if(user) {
          let n = 0;
          user.cartList.forEach(item => {
            n += item.productNum;
          });
          res.json({
            status: '1',
            msg: 'OK',
            result: n
          })
        }
      }
    })
  }
});

router.post('/addAddress',function (req, res, next) {
  let userName = req.cookies.userName,
      addressId = new Date().getTime(),
      recipient = req.body.recipient,
      phoneNumber = req.body.phoneNumber,
      postCode = req.body.postCode,
      selectAddress = req.body.selectAddress;

  User.findOne({userName: userName},function (err, user) {
    if(err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    }else {
      if(user) {
        let isDefault = false;
        if(user.addressList.length == 0){
          isDefault = true;
        };
        let newList = {
          addressId: addressId,
          userName: recipient,
          streetName: selectAddress,
          postCode: postCode,
          tel: phoneNumber,
          isDefault: isDefault
        };
        user.addressList.push(newList);
        console.log(user.addressList);
        user.save(function (err1, doc) {
          if(err1) {
            res.json({
              status: '0',
              msg: err1.message,
              result:''
            });
          }else {
            res.json({
              status: '1',
              msg: 'OK',
              result: ''
            })
          }
        })
      }
    }
  })
})
module.exports = router;
