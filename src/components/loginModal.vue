<template>
  <div class="loginModal">
    <div class="overlay" @click="closeLoginModal"></div>
    <div class="login">
      <h3 class="text-center">登录界面</h3>
      <a href="javascript:;" class="close" @click="closeLoginModal">x</a>
      <div class="text-left error" v-show="showError"> 用户名或密码错误</div>
      <div class="form-group user">
        <span class="glyphicon glyphicon-user"></span>
        <input type="text" class="form-control" placeholder="UserName" v-model="userName">
      </div>
      <div class="form-group pws">
        <span class="glyphicon glyphicon-lock"></span>
        <input type="password" class="form-control" placeholder="Password" v-model="password" @keyup.enter="checkUser">
      </div>
      <button class="btn btn-primary btn-block" @click="checkUser">登录</button>
    </div>
  </div>
</template>
<style>

  .loginModal{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  .loginModal>.overlay{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0,0,0,0.5);
  }
  .loginModal>.overlay{
    position: absolute;
  }
  .login {
    width: 320px;
    height: 280px;
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
  .login>h3{
    padding: 25px;
  }
  .login>.btn-primary{
    height: 34px;
  }
  .login>.user,
  .login>.pws{
    position: relative;
    margin-top: 20px;
  }
  .login>.form-group>span{
    position: absolute;
    left: 5px;
    top: 10px;
    color: grey;
  }
  .login .form-control{
    padding-left: 20px;
  }
  .login>.error{
    color: red;
    position: absolute;
    left: 15px;
    top: 85px;
  }
  .login>.close{
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
      showError: false,
      userName: '',
      password:''
    }
  },
  methods: {
    closeLoginModal() {
      this.$emit('closeLoginModal')
    },
    checkUser() {
      if(!this.userName || !this.password) {
        alert('用户名和密码不能为空');
        return;
      }
      axios.post('/users/login',{
        userName: this.userName,
        password: this.password
      }).then(result =>{
        let res = result.data;
        if(res.status == '0') {
          alert(res.msg);
        }else if(res.status == '2'){
          this.showError = true;
        }else {
          /*文本框用户名和密码为空*/
          this.userName = this.password = '';
          this.showError = false;
          /*保存用户名*/
          /*传递给父组件*/
          /*this.$emit('setUserName',res.result.userName);*/
          this.$store.commit('updateName',res.result.userName);
          this.$store.commit('initCartCount',res.result.cartCountNum);
          this.closeLoginModal();
        }
      })
    }

  }
}
</script>
