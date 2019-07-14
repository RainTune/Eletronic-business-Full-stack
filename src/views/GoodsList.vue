<template>
  <div>
    <nav-header></nav-header>
    <nav-content>
      <span slot="bread">Goods</span>
    </nav-content>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" :class="{'default':classType==='default', 'cur':classType==='default'}" @click="sortGoodsDefault()">Default</a>
          <a href="javascript:void(0)" :class="{'price':classType==='price','cur':classType==='price'}" @click="sortGoods">
            Price
            <strong style="font-weight: 600;" v-show="sortFlag">↑</strong>
            <strong style="font-weight: 600;" v-show="!sortFlag">↓</strong>
            <svg class="icon icon-arrow-short">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop " @click="showFilterPrice">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterByFlag}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="getAllgoods" :class="{'cur': priceChecked === 'all'}">All</a></dd>
              <dd v-for="(item,i) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(i)" :class="{'cur': priceChecked === i}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="item.productId">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+ item.productImage"  alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">售价：{{item.salePrice | currency('￥')}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" v-show="loadMoreFlag">
                玩命加载中...
                <div>
                  <img src="/static/loading/loading-bubbles.svg" alt="">
                </div>
              </div>
              <div v-show="!loadMoreFlag" style="text-align: center;color: grey">
                客官：全部已经加载完了！
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal v-show="showModal" @close="closeModal">
      <p slot="message">请您先登录，否则无法加入购物车！</p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn-primary btn-lg" @click="closeModal">关闭</a>
      </div>
    </modal>
    <modal v-show="showModalCart" @close="closeModal">
      <p slot="message">
        <span class="glyphicon glyphicon-ok" style="color: green; margin-right: 5px"></span>加入成功
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn-success" @click="closeModal">继续购物</a>
        <router-link to="/cart" class="btn btn-success" @click="closeModal">去购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>


</style>
<script>

  import navHeader from "@/components/Header.vue";
  import navFooter from "@/components/Footer.vue";
  import navContent from "@/components/Content.vue";
  import Modal from '@/components/Modal.vue';
  import axios from "axios";

  export default {
    data() {
      return {
        goodsList:[],
        priceFilter:[
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '1500.00'
          },
          {
            startPrice: '1500.00',
            endPrice: '2000.00'
          }
        ],
        priceChecked: 'all',
        filterByFlag: false,
        overLayFlag: false,
        page: 1,
        pageSize: 8,
        sortFlag: true,
        busy: false,
        loadMoreFlag:true,
        classType: 'default',
        showModal: false,
        showModalCart: false
      }
    },
    components: {
      navHeader,
      navFooter,
      navContent,
      Modal
    },
    mounted() {
      this.getGoodslist();
    },
    methods: {
      getGoodslist(flag) {
        let params = {
          page: this.page,
          pageSize: this.pageSize
        };
        if(this.classType === "price"){
          params.sort=this.sortFlag?1:-1
        }
        if(this.priceChecked != "all") {
          var level = parseInt(this.priceChecked);
          var startPrice = this.priceFilter[level].startPrice;
          var endPrice = this.priceFilter[level].endPrice;
          params.startPrice = startPrice;
          params.endPrice = endPrice;
        }

        axios.get('/goods/list',{
          params:params
        }).then(result =>{
          let res = result.data;
          if(res.status == '1') {
            if(flag){
              this.goodsList = this.goodsList.concat(res.result.list);
              if(parseInt(res.result.count) < this.pageSize) {
                this.busy = true;
                this.loadMoreFlag = false;
              }else {
                this.busy = false
              }

            }else {
              this.goodsList = res.result.list;
            }
          }else {
            this.goodsList = []
          }

        })
      },
      showFilterPrice() {
        this.filterByFlag = true;
        this.overLayFlag = true;
      },
      setPriceFilter(index) {
        this.priceChecked = index;
        this.closeLay();
        this.busy = false;
        this.loadMoreFlag = true;
        this.page = 1;
        this.getGoodslist();
      },
      closeLay() {
        this.overLayFlag = false;
        this.filterByFlag = false;
      },
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;

        this.busy = false;
        this.loadMoreFlag = true;

        this.classType = "price";
        this.getGoodslist();
      },
      loadMore: function() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodslist(true);
        }, 1000);
      },
      sortGoodsDefault(){
        this.classType = "default";
        this.busy = false;
        this.page = 1;
        this.loadMoreFlag = true;
        this.getGoodslist();
      },
      getAllgoods() {
        if(this.priceChecked!=='all'){
          this.priceChecked = 'all';
          this.busy = false;
          this.page = 1;
          this.loadMoreFlag = true;
          this.getGoodslist();
        }
      },
      addCart(id) {
         axios.post("/goods/addCart",{
           productId: id
         }).then( result =>{
           let res = result.data;
           if(res.status == '1'){
             this.showModalCart = true;
             this.$store.commit('updateCartCount',1)
           }else{
             this.showModal = true;
           }
         })
      },
      closeModal() {
        this.showModal = false;
        this.showModalCart = false;
      }
    }
  }
</script>
