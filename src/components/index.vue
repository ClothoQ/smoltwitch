<template>
  <div class="index">

    <nav v-bind:class="menu" class="navbar navbar-expand-md navbar-dark navCustom">
        <div class=" order-1 order-md-0">
            <ul class="navbar-nav mr-auto" style="display: -webkit-inline-box;">
              <a class="navbar-brand">
                <img :src="userProfile"   v-on:click="changeStreamer()" alt="logo" style="width:25px; outline:2.5px solid #2B8176;">
              </a>
              <a class="navbar-brand" v-if="!watching" style="min-height:25px;  display: flex;align-items: center">
                <img src="../assets/icon/logout.png"  v-on:click="logout()"    class="showChat"  alt="logo" style="width:16px;">
              </a>
              <a class="navbar-brand" v-if="!watching" style="min-height:25px;  display: flex;align-items: center">
                <img src="../assets/icon/resize.png"  v-on:click="changeSize()"  class="showChat"  alt="logo" style="width:16px;">
              </a>
              <!-- TODO: Chat -> on/off fix -->
              <a class="navbar-brand" v-if="watching" style="min-height:25px;  display: flex;align-items: center">
                <img src="../assets/icon/add-dialogue-box.png"    class="showChat"  alt="logo" style="width:16px;">
                <img src="../assets/icon/single-dialogue-box.png" class="hideChat"  alt="logo" style="display:none;width:16px;">
              </a>
              <!-- TODO: Mute -> on/off fix -->
              <a class="navbar-brand" v-if="watching" style="min-height:25px;  display: flex;align-items: center">
                <img src="../assets/icon/sound.png"    class="showChat"  alt="logo" style="width:16px;">
                <img src="../assets/icon/mute.png" class="hideChat"  alt="logo" style="display:none;width:16px;">
              </a>
            </ul>
        </div>
        <div v-if="streamerGame" class="mx-auto order-2 gameTitle">
              <a  class="navbar-brand mx-auto" style="font-size:14px;color:#64C4B8; max-width: 20ch !important;    text-overflow: ellipsis; overflow: hidden;vertical-align: bottom"><p style="color:#318178;display:inline; ">Playing</p>  {{streamerGame}}</a>
        </div>
        <div class="order-4">
            <ul class="navbar-nav ml-auto">
              <div v-if="streamerName" class="mx-auto order-0">
                  <a class="navbar-brand mx-auto" style="font-size:14px;color:#64C4B8;">{{streamerName}}</a>
                  <img src="../assets/icon/circle.png" class="blink" alt="logo" style="width:8px; margin-left:5px;">
              </div>
            </ul>
        </div>
    </nav>

    <div class="streamers">
    <div  v-if="!watching"  class="grid-container grid-container--fit">
        <div v-for="follower in liveStreamers" class="grid-element">
             <img  v-on:click="setStreamer(follower.channel.name, follower.channel.game)" :src="follower.channel.logo" class="center streamer"/>
        </div>
    </div>
  </div>

    <!-- TODO: Center load.svg -->
    <h1  v-if="liveStreamers.length == 0" >
      <svg class="lds-comets" width="100%" height="40px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="scale(-1,1) translate(-100,0)"><g transform="rotate(133.473 50 50)">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" values="360 50 50;0 50 50" keyTimes="0;1" dur="0.9s" keySplines="0.5 0.5 0.5 0.5" calcMode="spline"></animateTransform>
      <path fill="#c464c4" d="M91,74.1C75.6,98,40.7,102.4,21.2,81c11,9.9,26.8,13.5,40.8,8.7c7.4-2.5,13.9-7.2,18.7-13.3 c1.8-2.3,3.5-7.6,6.7-8C90.5,67.9,92.7,71.5,91,74.1z"></path>
      <path fill="#64c4b8" d="M50.7,5c-4,0.2-4.9,5.9-1.1,7.3c1.8,0.6,4.1,0.1,5.9,0.3c2.1,0.1,4.3,0.5,6.4,0.9c5.8,1.4,11.3,4,16,7.8 C89.8,31.1,95.2,47,92,62c4.2-13.1,1.6-27.5-6.4-38.7c-3.4-4.7-7.8-8.7-12.7-11.7C66.6,7.8,58.2,4.6,50.7,5z"></path>
      <path fill="#647cc4" d="M30.9,13.4C12,22.7,2.1,44.2,7.6,64.8c0.8,3.2,3.8,14.9,9.3,10.5c2.4-2,1.1-4.4-0.2-6.6 c-1.7-3-3.1-6.2-4-9.5C10.6,51,11.1,41.9,14.4,34c4.7-11.5,14.1-19.7,25.8-23.8C37,11,33.9,11.9,30.9,13.4z"></path></g></g></svg>
      <p style="color:#64c4b8; text-align:center; font-size:14px;margin-top:15px;">{{msg}}</p>
    </h1>

    <div v-bind:class="stream" class="stream" style="width:100%;height:99%;">
      <div style="height:100%;position:fixed;top:0px;width:100%;"></div>
      <div id="twitch-embed" style="height:100%;"></div>
    </div>
  </div>
</template>


<script>
  const fs   = require('fs');
  var config = require('../config.json');

  import 'twitch-embed';
  const ipcRenderer = require('electron').ipcRenderer;

  export default {
    name: 'index',
    data() {
      return {
          menu: {
            'hide': false
          },
          stream: {
            'hideT': false
          },
          msg : '',
          watching: false,
          selected: false,
          streamerGame : '',
          twitchPlayer : '',
          streamerName : ''
      }
    },
    props : {
      userProfile : '',
      liveStreamers : '',
    },
  	mounted: function () {
  		this.created();
  	},
    methods: {
      created: function () {
        this.msg = 'Searching'
        var self = this;
        setTimeout(function(){
            self.msg = 'No one is online :('
        }, 3500);
      },
      logout : function () {
         this.$emit('logout')
      },
      changeSize : function() {
          ipcRenderer.send('resize',  config.screen[config.screenSelected].w, config.screen[config.screenSelected].h);
          config.screenSelected++;
          if(config.screenSelected == config.screen.length){ config.screenSelected = 0;}
          fs.writeFile('./src/config.json', JSON.stringify(config), (err) => {
              if (err) throw err;
          });
      },
      changeStreamer : function(){
          if(this.selected){
              this.menu.hide    = this.menu.hide     ? false : true
              this.stream.hideT = !this.stream.hideT ? true  : false
              this.watching     = this.stream.hideT  ? false : true
          }
      },
      setStreamer : function(name, gameName) {
          new window.Twitch.Player("twitch-embed", {
              width: '100%',
              height: '100%',
              layout: 'video',
              theme:"dark",
              channel: name,
              autoplay: true
          });

          this.menu.hide    = true
          this.streamerName = name
          this.streamerGame = gameName
          this.watching     = true
          this.stream.hideT = false
          this.selected     = true;
      }
    }
  }

</script>
