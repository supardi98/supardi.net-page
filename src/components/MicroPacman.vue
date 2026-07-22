<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAudio } from '../composables/useAudio'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const { playHoverSound } = useAudio()

const gameCanvas = ref(null)
const gameScore = ref(0)
const isGameOver = ref(false)
let gameInterval = null;
let handleGameInput = null;

const initGame = () => {
  if (!gameCanvas.value) return;
  const canvas = gameCanvas.value;
  const ctx = canvas.getContext('2d');
  
  const gridSize = 15;
  const tileCountX = Math.floor(canvas.width / gridSize);
  const tileCountY = Math.floor(canvas.height / gridSize);
  
  let px = 10, py = 10; 
  let ax = 15, ay = 10; 
  let gx = 2, gy = 2; 
  
  let xv = 0, yv = 0; 
  
  gameScore.value = 0;
  isGameOver.value = false;
  
  handleGameInput = (e) => {
    switch(e.key) {
      case 'ArrowLeft': case 'a': xv = -1; yv = 0; break;
      case 'ArrowUp': case 'w': xv = 0; yv = -1; break;
      case 'ArrowRight': case 'd': xv = 1; yv = 0; break;
      case 'ArrowDown': case 's': xv = 0; yv = 1; break;
    }
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) > -1) {
        e.preventDefault();
    }
  }
  
  window.removeEventListener('keydown', handleGameInput, { passive: false });
  window.addEventListener('keydown', handleGameInput, { passive: false });
  
  const gameLoop = () => {
    if (isGameOver.value) return;
    
    px += xv;
    py += yv;
    
    if (px < 0) px = tileCountX - 1;
    if (px >= tileCountX) px = 0;
    if (py < 0) py = tileCountY - 1;
    if (py >= tileCountY) py = 0;
    
    if (Math.random() > 0.75) {
      if (gx < px) gx++;
      else if (gx > px) gx--;
      else if (gy < py) gy++;
      else if (gy > py) gy--;
    }
    
    if (gx < 0) gx = 0;
    if (gx >= tileCountX) gx = tileCountX - 1;
    if (gy < 0) gy = 0;
    if (gy >= tileCountY) gy = tileCountY - 1;
    
    if (px === gx && py === gy) {
      isGameOver.value = true;
      return;
    }
    
    if (px === ax && py === ay) {
      gameScore.value += 10;
      ax = Math.floor(Math.random() * tileCountX);
      ay = Math.floor(Math.random() * tileCountY);
      playHoverSound();
    }
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(ax * gridSize, ay * gridSize, gridSize - 2, gridSize - 2);
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(gx * gridSize, gy * gridSize, gridSize - 2, gridSize - 2);
    
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    let mouthOffset = 0.2;
    if (xv === -1) mouthOffset = 1.2;
    else if (yv === -1) mouthOffset = 1.7;
    else if (yv === 1) mouthOffset = 0.7;
    
    const isOpenMouth = (Date.now() % 300) > 150;
    if (!isOpenMouth) {
      ctx.arc(px * gridSize + gridSize/2, py * gridSize + gridSize/2, gridSize/2 - 1, 0, 2 * Math.PI);
    } else {
      ctx.arc(px * gridSize + gridSize/2, py * gridSize + gridSize/2, gridSize/2 - 1, (mouthOffset) * Math.PI, (mouthOffset + 1.6) * Math.PI);
      ctx.lineTo(px * gridSize + gridSize/2, py * gridSize + gridSize/2);
    }
    ctx.fill();
    
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=gridSize) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=gridSize) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
  }
  
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 150);
}

const closeGame = () => {
  if (gameInterval) clearInterval(gameInterval);
  if (handleGameInput) {
    window.removeEventListener('keydown', handleGameInput);
    handleGameInput = null;
  }
  emit('close');
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    setTimeout(initGame, 100)
  } else {
    closeGame()
  }
})

onMounted(() => {
  if (props.isOpen) {
    setTimeout(initGame, 100)
  }
})

onUnmounted(() => {
  closeGame()
})
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" @click="closeGame"></div>
      <div class="relative bg-black border-2 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)] flex flex-col items-center p-4">
        
        <div class="w-full flex justify-between items-center text-green-500 font-mono mb-2 border-b border-green-500/50 pb-2">
          <span>> MICRO_PACMAN.exe</span>
          <span class="text-yellow-400">SCORE: {{ gameScore }}</span>
        </div>

        <canvas ref="gameCanvas" width="300" height="300" class="border border-green-900 bg-black"></canvas>
        
        <div v-if="isGameOver" class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 backdrop-blur-sm">
          <span class="text-red-500 font-bold text-3xl mb-2 tracking-widest uppercase animate-pulse">GAME OVER</span>
          <span class="text-yellow-400 font-mono mb-8">FINAL SCORE: {{ gameScore }}</span>
          <button @click="initGame" class="px-6 py-2 border border-green-500 text-green-500 font-bold hover-blink mb-4">
            [ RESTART ]
          </button>
          <button @click="closeGame" class="text-green-700 text-xs hover:text-green-400">
            EXIT SYSTEM
          </button>
        </div>
        
        <div class="w-full text-center text-green-700 text-[10px] font-mono mt-4 uppercase tracking-widest leading-relaxed">
          [ W A S D ] OR [ ARROWS ] TO MOVE.<br/>
          EAT <span class="text-green-500">DATA</span>. AVOID RED <span class="text-red-500">VIRUS</span>.
        </div>
      </div>
    </div>
  </transition>
</template>
