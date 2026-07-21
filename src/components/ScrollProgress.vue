<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { useAudio } from '../composables/useAudio'

const emit = defineEmits(['open-game'])

const { playClickSound } = useAudio()

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

const navigateSection = (direction) => {
  playClickSound()
  const sections = Array.from(document.querySelectorAll('.scroll-section'))
  if (sections.length === 0) return
  
  const currentScroll = window.scrollY
  const offset = 100
  
  let target = null
  
  if (direction === 'down') {
    target = sections.find(s => s.offsetTop > currentScroll + offset)
  } else {
    target = sections.slice().reverse().find(s => s.offsetTop < currentScroll - offset)
  }
  
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
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
    
    <!-- Navigation Buttons -->
    <div v-if="scrollProgress > 5" class="absolute bottom-full right-4 mb-4 flex flex-col gap-2 z-50">
      <button @click="navigateSection('up')" class="w-10 h-10 flex items-center justify-center border border-green-500 bg-black/80 hover:bg-green-500 hover:text-black transition-colors text-green-500 backdrop-blur-md shadow-[0_0_10px_rgba(34,197,94,0.2)]">
        <ChevronUp class="w-6 h-6" />
      </button>
      <button @click="navigateSection('down')" class="w-10 h-10 flex items-center justify-center border border-green-500 bg-black/80 hover:bg-green-500 hover:text-black transition-colors text-green-500 backdrop-blur-md shadow-[0_0_10px_rgba(34,197,94,0.2)]" v-if="scrollProgress < 100">
        <ChevronDown class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
