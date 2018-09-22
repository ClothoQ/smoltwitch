<template>
  <div id="app">
      <menubar/>
      <auth  v-on:authOK="setAuth"  v-on:imageOK="setImg"  v-on:streamersOK="setStreamers"  v-if="!auth"/>
      <index v-else="!auth" :userProfile="userProfile" :liveStreamers="liveStreamers"  v-on:logout="logout"/>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import auth    from  './components/auth.vue'
  import index   from './components/index.vue'
  import menubar from './components/menubar.vue'

  export default {
    name: 'app',
    components: {
        auth, index, menubar
    },
    data()  {
      return {
          auth : false,
          username: '',
          userProfile: '',
          liveStreamers : ''
      }
    },
    methods: {
      logout () {
          this.auth = false
      },
      setAuth (value) {
          this.auth = true
      },
      setImg (value, value2) {
          this.userProfile = value
          this.username    = value2;
      },
      setStreamers (streamers) {
          this.liveStreamers = streamers;
      }
    }
  }
</script>

<style>
   @import './assets/css/style.css';
</style>
