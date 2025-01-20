<template>
  <div class="mobile-controls" v-if="isMobile">
    <div class="control-row">
      <button class="control-btn up" @touchstart="handleTouch('up')" @touchend="clearInterval">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    </div>
    <div class="control-row">
      <button class="control-btn left" @touchstart="handleTouch('left')" @touchend="clearInterval">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
        </svg>
      </button>
      <button class="control-btn down" @touchstart="handleTouch('down')" @touchend="clearInterval">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
        </svg>
      </button>
      <button class="control-btn right" @touchstart="handleTouch('right')" @touchend="clearInterval">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from 'vue'

const isMobile = ref(false)
let moveInterval: number | null = null

const emit = defineEmits<{
  (e: 'move', direction: 'up' | 'down' | 'left' | 'right'): void
}>()

const handleTouch = (direction: 'up' | 'down' | 'left' | 'right') => {
  emit('move', direction)
  // 长按连续移动
  clearInterval()
  moveInterval = setInterval(() => {
    emit('move', direction)
  }, 150) // 调整间隔时间以获得适当的移动速度
}

const clearInterval = () => {
  if (moveInterval) {
    window.clearInterval(moveInterval)
    moveInterval = null
  }
}

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<style scoped>
.mobile-controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(255, 255, 255, 0.4);  /* 更透明的背景 */
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);  /* 增加模糊效果 */
  box-shadow: 
    0 10px 20px rgba(0,0,0,0.1),
    0 6px 6px rgba(0,0,0,0.1),
    inset 0 0 15px rgba(255, 255, 255, 0.3);  /* 添加内部光晕 */
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.control-btn {
  touch-action: manipulation;
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(145deg, 
    rgba(74, 210, 149, 0.8),  /* 半透明的按钮颜色 */
    rgba(66, 184, 131, 0.8)
  );
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);  /* 按钮自身也添加模糊效果 */
  box-shadow: 
    0 4px 8px rgba(66, 184, 131, 0.2),
    inset 0 -2px 5px rgba(0,0,0,0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);  /* 添加微妙的边框 */
}

.control-btn:active {
  transform: translateY(2px);
  background: linear-gradient(145deg, 
    rgba(66, 184, 131, 0.9),  /* 按下时稍微不那么透明 */
    rgba(58, 168, 118, 0.9)
  );
  box-shadow: 
    0 2px 4px rgba(66, 184, 131, 0.2),
    inset 0 2px 5px rgba(0,0,0,0.1);
}

.control-btn svg {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
  opacity: 0.9;  /* 图标也稍微透明 */
}

/* 移除不必要的渐变重复 */
.up, .down, .left, .right {
  background: linear-gradient(145deg, 
    rgba(74, 210, 149, 0.8),
    rgba(66, 184, 131, 0.8)
  );
}

/* 适配较小屏幕 */
@media (max-width: 480px) {
  .control-btn {
    width: 90px;
    height: 80px;
  }
  
  .control-btn svg {
    width: 35px;
    height: 35px;
  }
  
  .mobile-controls {
    padding: 15px;
    gap: 12px;
  }

  .control-row {
    gap: 12px;
  }
}
</style>
