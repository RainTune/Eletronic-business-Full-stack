<template>
  <div>
    <header class="header">
      <symbol id="icon-cart" viewBox="0 0 38 32">
        <title>cart</title>
        <path class="path1" d="M37.759 0h-4.133c-0.733 0.004-1.337 0.549-1.434 1.255l-0.546 4.342c-0.081 0.484-0.496 0.849-0.997 0.849-0.005 0-0.009-0-0.014-0h-27.604c-0.003 0-0.007-0-0.011-0-1.674 0-3.031 1.357-3.031 3.031 0 0.34 0.056 0.666 0.159 0.971l2.52 8.062c0.385 1.194 1.486 2.043 2.785 2.043 0.126 0 0.25-0.008 0.372-0.023l22.983 0.002c0.515 0.131 0.626 0.768 0.626 1.283 0.005 0.044 0.009 0.095 0.009 0.146 0 0.501-0.294 0.933-0.718 1.134l-22.439 0.003c-0.354 0-0.642 0.287-0.642 0.642s0.287 0.642 0.642 0.642h22.745l0.131-0.071c0.919-0.392 1.551-1.287 1.551-2.33 0-0.058-0.002-0.116-0.006-0.173 0.021-0.108 0.033-0.24 0.033-0.376 0-1.072-0.732-1.973-1.724-2.23l-23.357-0.004c-0.063 0.008-0.135 0.013-0.209 0.013-0.719 0-1.332-0.455-1.566-1.093l-2.53-8.095c-0.048-0.154-0.076-0.332-0.076-0.515 0-0.973 0.782-1.764 1.752-1.778h27.657c1.159-0.004 2.112-0.883 2.232-2.011l0.547-4.345c0.010-0.083 0.078-0.147 0.161-0.152l4.133-0c0.354 0 0.642-0.287 0.642-0.642s-0.287-0.642-0.642-0.642z"></path>
        <path class="path2" d="M31.323 9.69c-0.022-0.003-0.048-0.004-0.074-0.004-0.328 0-0.598 0.248-0.633 0.567l-0.809 7.268c-0.003 0.022-0.004 0.048-0.004 0.074 0 0.328 0.248 0.598 0.567 0.633l0.074 0c0.001 0 0.003 0 0.004 0 0.327 0 0.596-0.246 0.632-0.563l0.809-7.268c0.003-0.022 0.004-0.048 0.004-0.074 0-0.328-0.248-0.598-0.567-0.633z"></path>
        <path class="path3" d="M27.514 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM27.514 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z"></path>
        <path class="path4" d="M9.599 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM9.599 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z"></path>
      </symbol>
      <div class="navbar">
        <div class="navbar-left-container">
          <a href="/">
            <img class="navbar-brand-logo" alt="" src="/static/logo.jpg">
          </a>
        </div>
        <div class="navbar-right-container" style="display: flex;">
          <div class="navbar-menu-container">
            <!--<a href="/" class="navbar-link">我的账户</a>-->
            <span class="navbar-link"></span>
            <span class="glyphicon glyphicon-home" v-text="nicknameF" v-if="nicknameF" style="display: inline-block; color: #ff5e36; border-radius: 5px;color: #ff544a;font-size: 16px;"></span>
            <a href="javascript:;" class="navbar-link" @click="showLoginModalFlag=true" v-if="!nicknameF">Login</a>
            <a href="javascript:void(0)" class="navbar-link" v-if="!nicknameF" @click="showRegisterModalFlag=true">Sign up</a>
            <a href="javascript:void(0)" class="navbar-link" v-if="nicknameF" @click="logout">Logout</a>
            <div class="navbar-cart-container">
              <span class="navbar-cart-count">{{$store.state.cartCountNum}}</span>
              <!--注意下面要是a标签，href必须是‘/#/cart’-->
              <router-link class="navbar-link navbar-cart-link" to="/cart">
                <svg class="navbar-cart-logo">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>
    <login-modal v-if="showLoginModalFlag" @closeLoginModal="closeLoginModal" @setUserName="setUserName"></login-modal>
    <register-modal v-if="showRegisterModalFlag" @closeRegisterModal="closeRegisterModal"></register-modal>
  </div>
</template>
<style>
  html,body{
    margin: 0;
    padding: 0;
  }
</style>
<script>
  import loginModal from './loginModal.vue';
  import registerModal from './registerModal.vue';
  import axios from 'axios';
  export default {
    data() {
      return {
        showLoginModalFlag: false,
        /*nicknameF: ''*/
        showRegisterModalFlag: false
      }
    },
    computed: {
      nicknameF: {
        get(){
          return this.$store.state.nickName;
        },
        set(val){
          this.$store.commit('updateName', val);
        }
      }
    },
    mounted() {
      this.checkLogin();
    },
    components:{
      loginModal,
      registerModal
    },
    methods:{
      checkLogin() {
        axios.get('/users/checkout').then(response => {
          let res = response.data;
          if(res.status == '1') {
            /*this.nicknameF = res.result;*/
            /*登录成功以后赋值用户名和购物车数量*/
            this.nicknameF = res.result;
            this.getCartCount()
          }else {
            if(this.$route.path != '/'){
              this.$router.push({
                path: '/'
              });
            }
          }
        })
      },
      closeLoginModal() {
        this.showLoginModalFlag = false;
      },
      closeRegisterModal() {
        this.showRegisterModalFlag = false;
      },
      setUserName(name) {
        this.nicknameF = name;
      },
      logout() {
        axios.post('/users/logout').then((response) => {
          let res = response.data;
          if(res.status == '1') {
            /*退出以后用户名和购物车数量为0*/
            this.nicknameF = '';
            this.$store.commit('initCartCount',0);
            /*退出以后立马回到首页*/
            this.$router.push({
              path: '/'
            });
          }
        })
      },
      /*获取购物车数量，登录的时候和检查是否登录都要获取购物车数量*/
      getCartCount() {
        axios.get('/users/getCartCount').then(response => {
          let res = response.data;
          if(res.status == '1') {
            this.$store.commit('initCartCount',res.result);
          }
        })
      }
    }
  }
</script>
