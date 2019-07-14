<template>
  <div class="registerModal">
    <div class="overlay" @click="closeRegisterModal"></div>
    <div class="register">
      <h3 class="text-center">注册界面</h3>
      <a href="javascript:;" class="close" @click="closeRegisterModal">x</a>
      <!--<div class="text-left error" v-show="showError">用户名已存在</div>
      <div class="text-left error" v-show="showErrorEmpty">用户名和密码不能为空</div>
      <div class="text-left error" v-show="showErrorPwd">两次密码不一致</div>-->
      <div class="text-left error">{{showError}}</div>
      <div class="form-group user">
        <span class="glyphicon glyphicon-user"></span>
        <input type="text" class="form-control" placeholder="UserName" v-model="userName">
      </div>
      <div class="form-group pws">
        <span class="glyphicon glyphicon-lock"></span>
        <input type="password" class="form-control" placeholder="Password" v-model="password">
      </div>
      <div class="form-group pwsAgain">
        <span class="glyphicon glyphicon-lock"></span>
        <input type="password" class="form-control" placeholder="Password Again" v-model="passwordAgain" @keyup.enter="checkUser">
      </div>
      <button class="btn btn-primary btn-block" @click="checkUser">注册</button>
    </div>
  </div>
</template>
<style>

  .registerModal{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  .registerModal>.overlay{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0,0,0,0.5);
  }
  .registerModal>.overlay{
    position: absolute;
  }
  .register {
    width: 320px;
    height: 320px;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    position: absolute;
    z-index: 1;
    /*background: #71e7f1;*/
    background-color: rgba(125,225,225,0.8);
    border: 1px solid cyan;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: 5px;
  }
  .register>h3{
    padding: 25px;
  }
  .register>.btn-primary{
    height: 34px;
  }
  .register>.user,
  .register>.pws,
  .register>.pwsAgain{
    position: relative;
    margin-top: 20px;
  }
  .register>.form-group>span{
    position: absolute;
    left: 5px;
    top: 10px;
    color: grey;
  }
  .register .form-control{
    padding-left: 20px;
  }
  .register>.error{
    color: red;
    position: absolute;
    left: 15px;
    top: 85px;
  }
  .register>.close{
    position: absolute;
    right: 10px;
    top: 5px;
    width: 10px;
    height: 10px;
  }
</style>
<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        showError: '',
        userName: '',
        password:'',
        passwordAgain: ''
      }
    },
    methods: {
      closeRegisterModal() {
        this.$emit('closeRegisterModal')
      },
      checkUser() {
        if(!this.userName || !this.password) {
          this.showError = '用户名或密码不能为空';
          return;
        }else if(this.password !== this.passwordAgain) {
          this.showError = '两次输入的密码不一致';
          return;
        }
        axios.post('/users/register',{
          userName: this.userName,
          userPwd: this.password
        }).then(result =>{
          let res = result.data;
          if(res.status == '0') {
            /*this.showError = res.msg*/
            this.showError = '服务器错误，请稍后重试...'
          }else if(res.status == '2'){
            this.showError = '用户名已存在';
          }else {
            /*文本框用户名和密码为空*/
            this.userName = this.password = this.showError = '';
            /*保存用户名*/
            /*传递给父组件*/
            /*this.$emit('setUserName',res.result.userName);*/
            this.$store.commit('updateName',res.result.userName);
            this.$store.commit('initCartCount',0);
            this.closeRegisterModal();
          }
        })
      }

    }
  }
</script>
