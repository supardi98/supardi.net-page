<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useAudio } from '../composables/useAudio'

const { playClickSound } = useAudio()
const canvasRef = ref(null)
let animationFrameId = null
const emit = defineEmits(['close'])

const handleClose = () => {
  playClickSound()
  emit('close')
}

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('')
  const fontSize = 16
  const columns = canvas.width / fontSize

  const drops = []
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -100 // randomize initial position
  }

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#0F0'
    ctx.font = fontSize + 'px monospace'

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)]
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
    
    // throttle slightly for matrix feel
    setTimeout(() => {
      animationFrameId = requestAnimationFrame(draw)
    }, 30)
  }

  draw()

  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const newColumns = canvas.width / fontSize
    while(drops.length < newColumns) {
      drops.push(Math.random() * -100)
    }
  }

  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<template>
  <div class="fixed inset-0 z-[999] bg-black overflow-hidden flex items-center justify-center cursor-pointer" @click="handleClose">
    <canvas ref="canvasRef" class="w-full h-full opacity-80"></canvas>
    
    <div class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      <div class="bg-black/90 px-6 py-4 border-2 border-green-500 shadow-[0_0_50px_#0f0] animate-pulse">
        <h1 class="text-4xl md:text-6xl text-green-500 font-bold font-mono tracking-widest uppercase text-center">SYSTEM OVERRIDE</h1>
        <p class="text-green-400 mt-2 text-center text-sm md:text-base font-mono uppercase tracking-widest">> Tap anywhere to abort &lt;</p>
      </div>
    </div>
  </div>
</template>
