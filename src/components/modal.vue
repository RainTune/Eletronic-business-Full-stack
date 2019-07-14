<template>
  <div class="Modal">
    <div class="overlay"></div>
    <div class="content">
      <a href="javascript:;" class="close" @click = "close">x</a>

      <div>
        <slot name="message"></slot>
      </div>
      <div>
        <slot name = "btnGroup"></slot>
      </div>
    </div>
  </div>
</template>
<style>

  .Modal{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  .Modal>.overlay{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0,0,0,0.5);
  }
  .Modal>.content {
    width: 320px;
    height: 160px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    position: fixed;
    z-index: 1;
    /*background: #71e7f1;*/
    background-color: rgba(125,225,225,0.8);
    border: 1px solid cyan;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .Modal>.content>.close{
    position: absolute;
    right: 10px;
    top: 5px;
    width: 10px;
    height: 10px;
    color: black;
  }
  .Modal>.content>div{
    width: 100%;
  }
  .Modal>.content a:nth-child(2){
    margin-left: 25px;
  }
  .Modal>.content a{
    color: white;
  }
</style>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
</script>
