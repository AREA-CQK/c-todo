<template>
  <div id="app">
    <Menu/>
    <router-view></router-view>
  </div>
</template>

<script>
  import Menu from '@/components/Menu/Menu.vue'
  console.log(Menu)
  export default {
    name: 'electron-todolist',
    components:{
        Menu : Menu
    }
  }
</script>

<style>
  html,body{
    height: 100%;
  }
  #app{
    height: 100%;
  }
</style>
