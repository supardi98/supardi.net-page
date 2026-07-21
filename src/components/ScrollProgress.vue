<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['open-game'])

const scrollProgress = ref(0)

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  if (scrollHeight > 0) {
    scrollProgress.value = Math.round((scrollTop / scrollHeight) * 100)
  } else {
    scrollProgress.value = 0
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const openGame = () => {
  emit('open-game')
}
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full h-8 bg-black/90 border-t border-green-500/40 z-50 flex items-center px-4 font-mono text-[10px] text-green-500 backdrop-blur-md">
    <div class="w-24 shrink-0 animate-pulse">PROGRESS</div>
    
    <div class="flex-1 mx-4 relative h-full flex items-center">
      <!-- The track -->
      <div class="w-full bg-green-900/30 h-2 border border-green-500/40 overflow-hidden relative">
         <div class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-150 ease-out" :style="{ width: `${scrollProgress}%` }"></div>
      </div>
      
      <!-- Pac-Man Crawler -->
      <div class="absolute top-1/2 -translate-y-1/2 transition-all duration-150 z-10" :style="{ left: `calc(${scrollProgress}% - 8px)` }">
        <svg v-if="scrollProgress % 2 === 0" viewBox="0 0 100 100" class="w-4 h-4 fill-yellow-400">
          <!-- Open mouth -->
          <path d="M 50 50 L 100 20 A 50 50 0 1 0 100 80 Z" />
        </svg>
        <svg v-else viewBox="0 0 100 100" class="w-4 h-4 fill-yellow-400">
          <!-- Slightly open mouth -->
          <path d="M 50 50 L 100 45 A 50 50 0 1 0 100 55 Z" />
        </svg>
      </div>
    </div>

    <!-- Play Button (appears at 100%) -->
    <button v-if="scrollProgress === 100" @click="openGame" class="shrink-0 ml-2 px-3 py-1 bg-green-500 text-black font-bold animate-pulse hover:animate-none hover:bg-green-400 uppercase tracking-widest text-xs border border-green-400">
      [ PLAY ]
    </button>

    <div v-else class="w-16 shrink-0 text-right">[{{ scrollProgress }}%]</div>
  </div>
</template>
