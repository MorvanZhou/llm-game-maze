<template>
  <div class="home">
    <div class="header">
      <img :src="LogoIcon" alt="游戏图标" class="logo" />
      <h1>迷宫探险</h1>
    </div>
    <MazeGame />
  </div>
</template>

<script lang="ts" setup>
import MazeGame from '@/components/MazeGame.vue'
import '@/assets/styles/home.css'
import LogoIcon from '@/assets/logo.jpeg'
</script>
