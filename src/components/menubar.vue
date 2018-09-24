<template>
  <div class="menubar">
    <nav  class="topbar" style="width:100%; height:8px; background:#151221; -webkit-app-region:drag;min-height:5px;  display: flex;align-items: center; ">
     <div class="menuButtons" v-on:click="closeAPP"  style="width:15px;height:8px;position: absolute; right: 0px;background:#ab202e;top:0;  -webkit-app-region: no-drag;"></div>
    </nav>
  </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer;
  export default {
    name: 'menubar',
    methods: {
      closeAPP : function () {
          ipcRenderer.send('close');
      }
    }
  }
</script>
