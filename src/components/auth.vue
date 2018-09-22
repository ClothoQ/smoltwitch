<template>
  <div class="auth" @keyup.enter="auth">
    <div class="container">
      <div class="row align-items-center ui-login">
       <div class="col center-UI">
         <div class="login">
          <p  style="color:#d0452f; text-transform: uppercase;font-weight:300;text-align:center;">{{msg}}</p>
          <div class="form-group">
              <input class="form-control custom" v-model="username" placeholder="Twitch Username">
              <button class="btn btn-primary mb-2 custom" v-on:click="auth">Login</button>
          </div>
         </div>
       </div>
     </div>
    </div>
  </div>
</template>


<script>
  import {getUserID, debug, getFollowers, streamerStatus} from '../assets/js/twitch.js'

  export default {
    name: 'auth',
    data() {
      return{
          msg: '',
          username : '',
      }
    },
    methods :{
       auth : function() {
        getUserID(this.username).then((data) => {
               this.$emit('imageOK', data.data[0].profile_image_url, this.username.replace(/\s/g, ''))
               return getFollowers(data.data[0].id);
          }).then((data) => {
               var tmp = [];
               for (var i = 0; i <  data.follows.length; i++) {
                 streamerStatus(data.follows[i].channel._id).then((data) => {
                    if(data.stream != null){
                        tmp.push(data.stream);
                    }
                 })
               }
               this.$emit('streamersOK', tmp)
               this.$emit('authOK', this.username.replace(/\s/g, ''))
          }).catch((errID) => {
               debug(errID).then((msg) => {
                  this.msg = msg;
               }).catch((rej) => {
                  this.msg = rej;
               })
          })
        }
    }
  }
</script>
