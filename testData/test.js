router.post('/addCart',function (req,res,next) {
  var userId = "100000077";
  var productId = req.body.productId;
  /*连接数据表*/
  const User = require("../Models/users.js");
  User.findOne({userId:userId},function (err,user) {
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
                msg: err.message
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
                msg: err.message
              })
            }else{
              if(doc) {
                doc.productNum = 1;
                doc.checked = 1;
                user.cartList.push(doc);
                user.save(function (err2) {
                  if(err2) {
                    res.json({
                      status: '0',
                      msg: err.message
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
