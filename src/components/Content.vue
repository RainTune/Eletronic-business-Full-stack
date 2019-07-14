<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <slot name="bread"></slot>
      </nav>
    </div>
  </div>
</template>
<style>
.nav-breadcrumb-wrap>.container>.nav-breadcrumb{
  text-align: left;
}
</style>
<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>
