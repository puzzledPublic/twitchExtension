<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view ></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html{
  height: 100%;
  background-image: linear-gradient(-128deg, rgba(255, 181, 32, 0.93) 3%, rgba(239, 39, 153, 0.93) 88%, rgba(237, 18, 171, 0.93) 100%);
}
#app {
  
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

}
</style>
