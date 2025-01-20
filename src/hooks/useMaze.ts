import { ref } from 'vue'
import { soundManager } from '@/utils/sound'

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
    adjustCellSize()
    
    // Initialize maze with walls
    const newMaze: Cell[][] = Array(size).fill(null).map((_, y) =>
      Array(size).fill(null).map((_, x) => ({
        x,
        y,
        isWall: true,
      }))
    )

    // Backtracking algorithm
    const stack: [number, number][] = []
    const visited = new Set<string>()

    const isValidCell = (x: number, y: number) => {
      return x > 0 && x < size - 1 && y > 0 && y < size - 1
    }

    const getUnvisitedNeighbors = (x: number, y: number) => {
      const neighbors: [number, number][] = [
        [x, y - 2], // up
        [x + 2, y], // right
        [x, y + 2], // down
        [x - 2, y], // left
      ]
      return neighbors.filter(([nx, ny]) => 
        isValidCell(nx, ny) && !visited.has(`${nx},${ny}`)
      )
    }

    const backtrackGenerate = (startX: number, startY: number) => {
      visited.add(`${startX},${startY}`)
      newMaze[startY][startX].isWall = false
      stack.push([startX, startY])

      while (stack.length > 0) {
        const [currentX, currentY] = stack[stack.length - 1]
        const neighbors = getUnvisitedNeighbors(currentX, currentY)

        if (neighbors.length === 0) {
          stack.pop()
          continue
        }

        // Randomly choose next cell
        const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)]
        const wallX = (currentX + nextX) >> 1
        const wallY = (currentY + nextY) >> 1

        // Carve path
        newMaze[wallY][wallX].isWall = false
        newMaze[nextY][nextX].isWall = false
        visited.add(`${nextX},${nextY}`)
        stack.push([nextX, nextY])
      }
    }

    // Start generation from (1,1)
    backtrackGenerate(1, 1)

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
