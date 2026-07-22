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
const gameDir = ref({ x: 0, y: 0 })
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
  
  gameDir.value = { x: 0, y: 0 };
  
  gameScore.value = 0;
  isGameOver.value = false;
  
  handleGameInput = (e) => {
    switch(e.key) {
      case 'ArrowLeft': case 'a': gameDir.value = {x: -1, y: 0}; break;
      case 'ArrowUp': case 'w': gameDir.value = {x: 0, y: -1}; break;
      case 'ArrowRight': case 'd': gameDir.value = {x: 1, y: 0}; break;
      case 'ArrowDown': case 's': gameDir.value = {x: 0, y: 1}; break;
    }
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) > -1) {
        e.preventDefault();
    }
  }
  
  window.removeEventListener('keydown', handleGameInput, { passive: false });
  window.addEventListener('keydown', handleGameInput, { passive: false });
  
  const gameLoop = () => {
    if (isGameOver.value) return;
    
    px += gameDir.value.x;
    py += gameDir.value.y;
    
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
    if (gameDir.value.x === -1) mouthOffset = 1.2;
    else if (gameDir.value.y === -1) mouthOffset = 1.7;
    else if (gameDir.value.y === 1) mouthOffset = 0.7;
    
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

const handleMobileInput = (dx, dy) => {
  gameDir.value = { x: dx, y: dy }
}

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
      
      <!-- Game Boy Device Layout -->
      <div class="relative bg-black/90 backdrop-blur-md border-2 border-green-500 rounded-t-xl rounded-b-[2.5rem] shadow-[0_0_40px_rgba(34,197,94,0.4)] flex flex-col items-center p-4 pt-6 pb-12 w-full max-w-sm mx-auto select-none">
        
        <!-- Screen Bezel -->
        <div class="bg-black border border-green-500/50 rounded-t-lg rounded-b-[2rem] p-4 pb-8 w-full flex flex-col items-center relative shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
           <div class="w-full flex justify-between items-center text-green-500/70 font-mono text-[10px] mb-2 uppercase px-2">
             <span class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> BATTERY</span>
           </div>
           
           <!-- Canvas Area -->
           <div class="relative border-2 border-green-500/80 bg-black overflow-hidden rounded-sm w-full max-w-[300px] flex flex-col">
              <!-- Header -->
              <div class="w-full flex justify-between items-center text-green-500 font-mono text-[10px] p-2 bg-black border-b border-green-500/80">
                <span>> HACKER_BOY</span>
                <span class="text-yellow-400 font-bold">SCORE: {{ gameScore }}</span>
              </div>
              
              <!-- Game Board -->
              <div class="relative w-full aspect-square">
                <canvas ref="gameCanvas" width="300" height="300" class="w-full h-full object-contain"></canvas>
                
                <div v-if="isGameOver" class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 backdrop-blur-sm">
                  <span class="text-red-500 font-bold text-2xl mb-1 tracking-widest uppercase animate-pulse">GAME OVER</span>
                  <span class="text-yellow-400 font-mono text-sm mb-4">FINAL: {{ gameScore }}</span>
                </div>
              </div>
           </div>
        </div>

        <!-- Brand -->
        <div class="w-full text-left mt-2 pl-4 text-green-500/70 font-bold italic tracking-widest text-sm">
          HACKER BOY
        </div>

        <!-- Controls -->
        <div class="w-full flex justify-between items-center mt-6 px-6">
          <!-- D-Pad -->
          <div class="relative w-24 h-24 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">
            
            <!-- Visual Grid -->
            <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 z-0">
              <div></div>
              <div class="bg-black border-t border-l border-r border-green-500 rounded-t-sm"></div>
              <div></div>
              
              <div class="bg-black border-l border-t border-b border-green-500 rounded-l-sm"></div>
              <div class="bg-black"></div>
              <div class="bg-black border-r border-t border-b border-green-500 rounded-r-sm"></div>
              
              <div></div>
              <div class="bg-black border-b border-l border-r border-green-500 rounded-b-sm"></div>
              <div></div>
            </div>
            
            <!-- Interactive buttons -->
            <button @click="handleMobileInput(0, -1)" class="absolute top-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-green-500/20 rounded-t-sm"></button>
            <button @click="handleMobileInput(0, 1)" class="absolute bottom-0 left-1/3 w-1/3 h-1/3 z-10 active:bg-green-500/20 rounded-b-sm"></button>
            <button @click="handleMobileInput(-1, 0)" class="absolute top-1/3 left-0 w-1/3 h-1/3 z-10 active:bg-green-500/20 rounded-l-sm"></button>
            <button @click="handleMobileInput(1, 0)" class="absolute top-1/3 right-0 w-1/3 h-1/3 z-10 active:bg-green-500/20 rounded-r-sm"></button>
            
            <!-- Center indent -->
            <div class="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-green-500/20 z-0 pointer-events-none"></div>
            
            <!-- Arrows -->
            <div class="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-[6px] border-l-transparent border-r-transparent border-b-green-500 pointer-events-none z-0"></div>
            <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-green-500 pointer-events-none z-0"></div>
            <div class="absolute left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-[6px] border-t-transparent border-b-transparent border-r-green-500 pointer-events-none z-0"></div>
            <div class="absolute right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent border-l-green-500 pointer-events-none z-0"></div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 transform -rotate-12 mt-8">
            <div class="flex flex-col items-center">
              <button @click="closeGame" class="w-10 h-10 rounded-full bg-black border border-green-500 active:bg-green-500 active:text-black shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all ease-out flex items-center justify-center font-bold text-green-500">B</button>
              <span class="text-[10px] text-green-500/70 font-mono mt-2 tracking-widest">EXIT</span>
            </div>
            <div class="flex flex-col items-center mb-4">
              <button @click="initGame" class="w-10 h-10 rounded-full bg-black border border-green-500 active:bg-green-500 active:text-black shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all ease-out flex items-center justify-center font-bold text-green-500">A</button>
              <span class="text-[10px] text-green-500/70 font-mono mt-2 tracking-widest">RETRY</span>
            </div>
          </div>
        </div>

        <!-- Start / Select -->
        <div class="flex gap-4 mt-8 mb-2">
          <div class="flex flex-col items-center">
            <button class="w-12 h-3 rounded-full bg-black border border-green-500 transform -rotate-12 active:bg-green-500 transition-all"></button>
            <span class="text-[8px] text-green-500/70 font-mono mt-1 tracking-widest uppercase">Select</span>
          </div>
          <div class="flex flex-col items-center">
            <button @click="initGame" class="w-12 h-3 rounded-full bg-black border border-green-500 transform -rotate-12 active:bg-green-500 transition-all"></button>
            <span class="text-[8px] text-green-500/70 font-mono mt-1 tracking-widest uppercase">Start</span>
          </div>
        </div>
        
        <!-- Speaker Grills -->
        <div class="absolute bottom-6 right-6 flex gap-2 transform -rotate-45 opacity-50">
          <div class="w-1.5 h-12 rounded-full border border-green-500/50"></div>
          <div class="w-1.5 h-12 rounded-full border border-green-500/50"></div>
          <div class="w-1.5 h-12 rounded-full border border-green-500/50"></div>
          <div class="w-1.5 h-12 rounded-full border border-green-500/50"></div>
        </div>
      </div>
    </div>
  </transition>
</template>
