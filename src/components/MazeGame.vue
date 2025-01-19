<template>
  <div class="game-info">
    <div class="info-container">
      <div class="game-level">
        <h2>Level {{ level }}</h2>
        <p>Size: {{ maze[0]?.length }}x{{ maze.length }}</p>
      </div>
      
      <div class="config-controls">
        <div class="size-control">
          <label>Cell Size: {{ cellSize }}px</label>
          <input 
            type="range" 
            :value="cellSize"
            min="10" 
            max="30" 
            @input="e => setCellSize(Number((e.target as HTMLInputElement).value))"
          >
        </div>

        <div class="size-control" v-if="level === 1">
          <label>Initial Map Size: {{ initialSize }}x{{ initialSize }}</label>
          <input 
            type="range" 
            :value="initialSize"
            min="5" 
            max="51" 
            step="2"
            @input="e => setInitialSize(Number((e.target as HTMLInputElement).value))"
          >
        </div>
      </div>
    </div>
  </div>
  <div class="maze-game">
    
    
    <div class="maze" :style="{ 
      gridTemplateColumns: `repeat(${maze[0]?.length || 0}, ${cellSize}px)` 
    }">
      <template v-for="row in maze" :key="row[0].y">
        <div
          v-for="cell in row"
          :key="`${cell.x}-${cell.y}`"
          :class="{
            'cell': true,
            'wall': cell.isWall,
            'path': !cell.isWall,
            'start': cell.isStart,
            'end': cell.isEnd,
            'player': playerPosition.x === cell.x && playerPosition.y === cell.y
          }"
        />
      </template>
    </div>

    <div v-if="hasWon" class="victory-modal">
      <h2>Congratulations! 🎉</h2>
      <p>You completed Level {{ level }}!</p>
      <button v-if="level * 2 + 3 <= 51" @click="handleNextLevel">Next Level</button>
      <p v-else>You've completed all levels!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useMaze } from '../hooks/useMaze'
import '../assets/styles/maze.css'

const {
  maze,
  playerPosition,
  hasWon,
  level,
  cellSize,
  generateMaze,
  movePlayer,
  nextLevel,
  setCellSize,
  initialSize,
  setInitialSize,
} = useMaze()

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp': movePlayer('up'); break
    case 'ArrowDown': movePlayer('down'); break
    case 'ArrowLeft': movePlayer('left'); break
    case 'ArrowRight': movePlayer('right'); break
  }
}

const handleNextLevel = () => {
  nextLevel()
}

onMounted(() => {
  generateMaze()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.maze-game {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.maze {
  display: grid;
  gap: 1px;
  background: #fff;
  padding: 2px;
  border-radius: 8px;
  box-shadow: 
    0 10px 20px rgba(0,0,0,0.1),
    0 6px 6px rgba(0,0,0,0.1);
  margin: 20px auto;
}

.cell {
  width: v-bind(cellSize + 'px');
  height: v-bind(cellSize + 'px');
  transition: background-color 0.2s;
}

.wall { background: #2c3e50; }
.path { 
  background: #fff;
  border: 1px solid #eee;
}
.start { 
  background: #42b883;
  animation: pulse 2s infinite;
}
.end { 
  background: #ff7675;
  animation: pulse 2s infinite;
}
.player {
  background: #3498db;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
  animation: bounce 0.5s ease-in-out;
}

.game-info {
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 10px;
}

.info-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: center;
}

.game-level {
  min-width: 150px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.game-level:hover {
  transform: translateY(-2px);
}

.game-level h2 {
  color: #2c3e50;
  font-size: 24px;
  margin: 0;
}

.config-controls {
  min-width: 280px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.size-control {
  margin: 0;
  padding: 5px 0;
}

.size-control label {
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 8px;
}

.size-control input[type="range"] {
  width: 200px;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.size-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #42b883;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.victory-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  text-align: center;
  animation: modalAppear 0.3s ease-out;
}

.victory-modal h2 {
  color: #42b883;
  margin-bottom: 15px;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #3aa876;
  transform: translateY(-2px);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0% { transform: scale(0.9); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes modalAppear {
  0% { 
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  100% { 
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 600px) {
  .info-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .game-info {
    padding: 1px;
  }
  
  .config-controls {
    min-width: 100%;
  }
}
</style>
