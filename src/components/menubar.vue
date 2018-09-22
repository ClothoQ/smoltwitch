<template>
  <div class="menubar">
    <nav  style="width:100%; height:5px; background:#151221; -webkit-app-region:drag;min-height:5px;  display: flex;align-items: center;">
     <div class="menuButtons" v-on:click="closeApp()"  style="width:15px; height:5px;position: absolute; right: 0px;background:#ab202e;"></div>
    </nav>
  </div>
</template>


<script>

  export default {
    name: 'menubar',
    methods: {
      closeApp : function () {
          // hold on
      }
    }
  }
</script>
