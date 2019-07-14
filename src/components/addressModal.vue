<template>
  <div class="addressModal">
    <div class="overlay" @click="closeAddressModal"></div>
    <div class="address">
      <h3 class="text-center">请完善以下信息</h3>
      <a href="javascript:;" class="close" @click="closeAddressModal">x</a>

      <div class="text-left error">{{showError}}</div>
      <div class="form-group">
        <span class="glyphicon glyphicon-user"></span>
        <input type="text" class="form-control" placeholder="Recipient" v-model="recipient">
      </div>
      <div class="form-group">
        <span class="glyphicon glyphicon-earphone"></span>
        <input type="tel" class="form-control" placeholder="PhoneNumber" v-model="phoneNumber">
      </div>
      <div class="form-group">
        <span class="glyphicon glyphicon-envelope"></span>
        <input type="text" class="form-control" placeholder="PostCode" v-model="postCode">
      </div>
      <p>Please select address</p>
      <v-distpicker @selected="getAddr" :province="province" :city="city" :area="area"></v-distpicker>
      <div class="form-group">
        <span class="glyphicon glyphicon-home"></span>
        <input type="text" class="form-control" placeholder="DetailAddress" v-model="detailAddress">
      </div>
      <button class="btn btn-warning" @click="closeAddressModal">取消</button>
      <button class="btn btn-primary" @click="postAddr">确定</button>
    </div>
  </div>
</template>
<style scoped>

  .addressModal{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  .addressModal>.overlay{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0,0,0,0.5);
  }
  .addressModal>.overlay{
    position: absolute;
  }
  .address {
    width: 320px;
    height: auto;
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
  .address>h3{
    padding: 25px;
  }
  .address>.btn{
    height: 34px;
    margin: 10px 20px;
  }
  .address>.form-group{
    position: relative;
  }
  .address>.form-group>span{
    position: absolute;
    left: 5px;
    top: 10px;
    color: grey;
  }
  .address .form-control{
    padding-left: 20px;
  }
  .address>.error{
    color: red;
    position: absolute;
    left: 15px;
    top: 85px;
  }
  .address>.close{
    position: absolute;
    right: 10px;
    top: 5px;
    width: 10px;
    height: 10px;
  }
</style>
<script>
  import axios from 'axios';
  import VDistpicker from 'v-distpicker';
  export default {
    data() {
      return {
        recipient: '',
        phoneNumber: '',
        postCode: '',
        detailAddress:'',
        showError:'',
        province: '广东省',
        city: '深圳市',
        area: '宝安区',
      }
    },
    computed: {
      selectAddress: function () {
        return this.province + '-' + this.city + '-' + this.area + '-'+ this.detailAddress;
      }
    },
    methods: {
      closeAddressModal() {
        this.showError = '';
        this.$emit('close')
      },
      getAddr(data) {
        this.province = data.province.value;
        this.city = data.city.value;
        this.area = data.area.value;
      },
      postAddr() {
        if(!this.recipient || !this.phoneNumber || !this.postCode || !this.detailAddress) {
          this.showError = '请全部填写完在提交';
          return;
        }
        axios.post('/users/addAddress',{
          recipient: this.recipient,
          phoneNumber: this.phoneNumber,
          postCode: this.postCode,
          selectAddress: this.selectAddress
        }).then(response => {
          let res = response.data;
          if(status === '0') {
            this.showError = '服务器故障，请稍后重试！'
          }else {
            var obj = {
              userName: this.recipient,
              streetName: this.selectAddress,
              tel: this.phoneNumber
            };
            this.recipient = this.phoneNumber = this.postCode = this.detailAddress  = '';
            this.closeAddressModal();
            this.addressList = [],
            this.$emit('callBackFromModal', obj);
          }
        })
      }
    },
    components: {
      VDistpicker
    }
  }
</script>
