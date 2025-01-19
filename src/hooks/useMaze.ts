import { ref } from 'vue'
import { soundManager } from '../utils/sound'

export type Cell = {
  x: number
  y: number
  isWall: boolean
  isStart?: boolean
  isEnd?: boolean
  isPath?: boolean
}

export function useMaze() {
  const level = ref(1)
  const cellSize = ref(30)
  const initialSize = ref(5)
  const maze = ref<Cell[][]>([])
  const playerPosition = ref<{ x: number; y: number }>({ x: 1, y: 1 })
  const hasWon = ref(false)
  const preferredCellSize = ref(30) // 存储用户期望的单元格大小

  const getCurrentSize = () => {
    const size = initialSize.value + (level.value - 1) * 2
    return Math.min(51, size) // 限制最大尺寸为 51
  }

  const calculateIdealCellSize = (windowWidth: number, mazeSize: number) => {
    // 留出边距和滚动条空间
    const availableWidth = windowWidth - 40
    // 计算理想单元格大小
    const idealSize = Math.floor(availableWidth / mazeSize)
    // 限制最小和最大值
    return Math.min(Math.max(idealSize, 1), preferredCellSize.value)  // 修改最小值为 1
  }

  const setCellSize = (size: number) => {
    preferredCellSize.value = Math.max(1, Math.min(30, size))  // 修改最小值为 1
    const currentSize = getCurrentSize()
    const windowWidth = window.innerWidth
    cellSize.value = calculateIdealCellSize(windowWidth, currentSize)
  }

  const adjustCellSize = () => {
    const currentSize = getCurrentSize()
    const windowWidth = window.innerWidth
    cellSize.value = calculateIdealCellSize(windowWidth, currentSize)
  }

  const generateMaze = () => {
    const size = getCurrentSize()
    adjustCellSize() // 在生成新迷宫时调整单元格大小
    // Initialize maze with walls
    const newMaze: Cell[][] = Array(size).fill(null).map((_, y) =>
      Array(size).fill(null).map((_, x) => ({
        x,
        y,
        isWall: true,
      }))
    )

    const carve = (x: number, y: number) => {
      newMaze[y][x].isWall = false

      const directions = [
        [0, -2], // up
        [2, 0],  // right
        [0, 2],  // down
        [-2, 0], // left
      ].sort(() => Math.random() - 0.5)

      for (const [dx, dy] of directions) {
        const newX = x + dx
        const newY = y + dy

        if (
          newX > 0 && newX < size - 1 &&
          newY > 0 && newY < size - 1 &&
          newMaze[newY][newX].isWall
        ) {
          newMaze[y + dy/2][x + dx/2].isWall = false
          carve(newX, newY)
        }
      }
    }

    // Start carving from position (1,1)
    carve(1, 1)

    // Set start and end points
    newMaze[1][1].isStart = true
    newMaze[size-2][size-2].isEnd = true

    maze.value = newMaze
    playerPosition.value = { x: 1, y: 1 }
    hasWon.value = false
  }

  const nextLevel = () => {
    if (level.value * 2 + 3 <= 51) {
      level.value++
      generateMaze()
      return true
    }
    return false
  }

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const { x, y } = playerPosition.value
    let newX = x
    let newY = y

    switch (direction) {
      case 'up': newY--; break
      case 'down': newY++; break
      case 'left': newX--; break
      case 'right': newX++; break
    }

    if (
      newX >= 0 && newX < getCurrentSize() &&
      newY >= 0 && newY < getCurrentSize()
    ) {
      if (!maze.value[newY][newX].isWall) {
        soundManager.play('move');
        playerPosition.value = { x: newX, y: newY }
        
        if (maze.value[newY][newX].isEnd) {
          soundManager.play('win');
          hasWon.value = true;
        }
      } else {
        soundManager.play('hit');
      }
    }
  }

  const setInitialSize = (size: number) => {
    initialSize.value = Math.max(5, Math.min(51, size))
    if (level.value === 1) {
      generateMaze()
    }
  }

  return {
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
    preferredCellSize,
    adjustCellSize,
  }
}
