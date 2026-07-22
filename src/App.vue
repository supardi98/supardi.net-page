<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Volume2, VolumeX, ChevronDown } from 'lucide-vue-next'
import { useAudio } from './composables/useAudio'

import BootSequence from './components/BootSequence.vue'
import HeroProfile from './components/HeroProfile.vue'
import ClassifiedDossier from './components/ClassifiedDossier.vue'
import MatrixOverlay from './components/MatrixOverlay.vue'
import FloatingLogs from './components/FloatingLogs.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import OperationLogs from './components/OperationLogs.vue'
import SkillsMatrix from './components/SkillsMatrix.vue'
import TerminalContact from './components/TerminalContact.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import MicroPacman from './components/MicroPacman.vue'

const { initAudio, playHoverSound, playClickSound, playTypingSound } = useAudio()

const isBooting = ref(true)
const audioRef = ref(null)
const isPlaying = ref(false)

const profile = ref({
  name: 'me@supardi:~#',
  bio: 'JOB: PROGRAMMER\nLOCATION: CIREBON, INDONESIA',
  image: '/avatar.png'
})

const displayedName = ref('')
const displayedBio = ref('')

const mouseX = ref(0)
const mouseY = ref(0)
const uptime = ref(0)
const sysTimeHex = ref('')

const isGameOpen = ref(false)
const isPortfolioDialogOpen = ref(false)
const isMatrixMode = ref(false)

const scrollY = ref(0)
const parallaxNodes = ref([])

let secretCode = ''
const handleGlobalKeydown = (e) => {
  secretCode += e.key.toLowerCase()
  if (secretCode.length > 6) {
    secretCode = secretCode.substring(secretCode.length - 6)
  }
  if (secretCode === 'matrix') {
    isMatrixMode.value = true
    secretCode = ''
  }
}

const formattedUptime = computed(() => {
  const h = Math.floor(uptime.value / 3600).toString().padStart(2, '0')
  const m = Math.floor((uptime.value % 3600) / 60).toString().padStart(2, '0')
  const s = (uptime.value % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
})

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

onMounted(() => {
  // Generate random parallax nodes
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+{}|:"<>?'
  for (let i = 0; i < 150; i++) {
    let str = ''
    for (let j = 0; j < Math.floor(Math.random() * 20 + 5); j++) {
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    parallaxNodes.value.push({
      text: str,
      left: Math.random() * 100,
      top: Math.random() * 300 - 50,
      speed: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.2 + 0.1,
      size: Math.random() * 2 + 0.8
    })
  }

  const handleScroll = () => {
    scrollY.value = window.scrollY
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const playAudio = async () => {
  if (audioRef.value && !isPlaying.value) {
    try {
      audioRef.value.volume = 0.1
      await audioRef.value.play()
      isPlaying.value = true
    } catch (err) {
      console.warn("Autoplay blocked. Waiting for interaction.")
    }
  }
}

const toggleAudio = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.volume = 0.1
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const handleEnterSystem = () => {
  isBooting.value = false
  // playAudio() // Disabled autoplay as requested

  const fullName = profile.value.name
  const fullBio = profile.value.bio
  
  let i = 0
  const typeName = () => {
    if (i < fullName.length) {
      displayedName.value += fullName.charAt(i)
      playTypingSound()
      i++
      setTimeout(typeName, Math.random() * 50 + 50)
    } else {
      setTimeout(typeBio, 300)
    }
  }

  let j = 0
  const typeBio = () => {
    if (j < fullBio.length) {
      displayedBio.value += fullBio.charAt(j)
      playTypingSound()
      j++
      setTimeout(typeBio, Math.random() * 30 + 30)
    }
  }

  setTimeout(typeName, 500)
}

const handleGlobalMouseOver = (e) => {
  if (e.target && e.target.closest && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.group') || e.target.closest('.cursor-pointer'))) {
    playHoverSound();
  }
}

const handleGlobalClick = (e) => {
  initAudio();
  if (e.target && e.target.closest && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.group') || e.target.closest('.cursor-pointer'))) {
    playClickSound();
  }
}

onMounted(() => {
  setInterval(() => {
    uptime.value++
    sysTimeHex.value = '0x' + Math.floor(Date.now() / 1000).toString(16).toUpperCase()
  }, 1000)

  window.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseover', handleGlobalMouseOver)
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseover', handleGlobalMouseOver)
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
  <div class="relative w-full min-h-screen bg-black text-green-500 font-mono overflow-x-hidden" style="cursor: crosshair">
    
    <!-- Audio Player -->
    <div class="fixed top-4 left-4 z-50">
      <button @click="toggleAudio" class="p-2 border border-green-500 bg-black/80 text-green-500 hover-blink transition-colors">
        <component :is="isPlaying ? Volume2 : VolumeX" class="w-4 h-4" />
      </button>
      <audio ref="audioRef" loop>
        <source src="/music.mp3" type="audio/mpeg">
      </audio>
    </div>

    <!-- Boot Sequence Screen -->
    <BootSequence 
      v-if="isBooting" 
      :isBooting="isBooting"
      @enter-system="handleEnterSystem"
    />

    <!-- Parallax Background -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Static Grid Base -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f380f22_1px,transparent_1px),linear-gradient(to_bottom,#0f380f22_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <!-- Moving Grid Layer -->
      <div 
        class="absolute -inset-[100%] bg-[linear-gradient(to_right,#0f380f33_1px,transparent_1px),linear-gradient(to_bottom,#0f380f33_1px,transparent_1px)] bg-[size:3rem_3rem]"
        :style="{ transform: `translateY(${scrollY * -0.3}px)` }"
      ></div>

      <!-- Floating Code/Binary Chunks -->
      <div class="absolute -inset-[100%]">
        <div 
          v-for="(node, idx) in parallaxNodes" 
          :key="idx" 
          class="absolute font-mono text-green-500 transition-transform ease-linear duration-75"
          :style="{ 
            left: `${node.left}%`, 
            top: `${node.top}%`, 
            opacity: node.opacity, 
            fontSize: `${node.size}rem`,
            transform: `translateY(${scrollY * -node.speed}px)`
          }"
        >
          {{ node.text }}
        </div>
      </div>
    </div>
    
    <!-- Cursor Interactive Glow -->
    <div 
      class="fixed inset-0 pointer-events-none z-0"
      :style="{ background: `radial-gradient(circle 600px at ${mouseX}px ${mouseY}px, rgba(34, 197, 94, 0.15), transparent 80%)` }"
    ></div>
    
    <!-- CRT Scanline Effect -->
    <div class="fixed inset-0 pointer-events-none scanlines z-50"></div>

    <!-- Main Content -->
    <div class="w-full flex flex-col items-center z-10 relative">
      
      <!-- Hero Section -->
      <main class="scroll-section w-full min-h-screen flex flex-col items-center justify-center p-6 relative">
        <HeroProfile 
          :profile="profile"
          :displayedName="displayedName"
          :displayedBio="displayedBio"
        />

        <!-- Scroll Indicator Arrow -->
        <a href="#dossier" class="absolute bottom-8 flex flex-col items-center justify-center animate-bounce text-green-500/70 hover:text-green-400 transition-colors cursor-pointer">
          <span class="text-[10px] font-mono tracking-widest mb-1">SCROLL_DOWN</span>
          <ChevronDown class="w-6 h-6" />
        </a>
      </main>

      <!-- Portfolio Section -->
      <section class="scroll-section w-full min-h-screen flex flex-col items-center justify-center p-6 relative">
        <PortfolioSection @dialog-toggled="isPortfolioDialogOpen = $event" />
      </section>

      <!-- Skills Section -->
      <section class="scroll-section w-full min-h-screen flex flex-col items-center justify-center p-6 relative">
        <SkillsMatrix />
      </section>

      <!-- Operation Logs / Experience Section -->
      <section class="scroll-section w-full min-h-screen flex flex-col items-center justify-center p-6 relative">
        <OperationLogs />
      </section>

      <!-- Contact Section -->
      <section class="scroll-section w-full min-h-screen flex flex-col items-center justify-center p-6 relative">
        <TerminalContact />
      </section>

      <!-- Classified Dossier Section (About Me) -->
      <section class="scroll-section w-full min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        <ClassifiedDossier @trigger-easter-egg="isMatrixMode = true" />
      </section>
    </div>

    <!-- Floating Live Logs -->
    <FloatingLogs />

    <!-- Easter Egg Matrix Overlay -->
    <transition name="fade">
      <MatrixOverlay v-if="isMatrixMode" @close="isMatrixMode = false" />
    </transition>

    <!-- Footer -->
    <footer class="mt-10 pt-10 pb-16 text-[10px] text-green-900 w-full text-center border-t border-green-900/30 uppercase tracking-widest z-10 relative">
      NETWORK: CLOUDFLARE_NODE // UPTIME: {{ formattedUptime }} // SYS_TIME: {{ sysTimeHex }}
    </footer>

    <!-- Scroll Progress Indicator -->
    <ScrollProgress v-if="!isBooting && !isGameOpen && !isPortfolioDialogOpen" @open-game="isGameOpen = true" />

    <!-- Game Modal -->
    <MicroPacman :isOpen="isGameOpen" @close="isGameOpen = false" />

  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #22c55e #000000;
  background-color: #000;
}

/* Custom Cursor */
* {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M0,0 v5 h2 v-3 h3 v-2 h-5 z M18,0 v5 h-2 v-3 h-3 v-2 h5 z M0,18 v-5 h2 v3 h3 v2 h-5 z M18,18 v-5 h-2 v3 h-3 v2 h5 z" fill="%234ade80" /><rect x="8" y="8" width="2" height="2" fill="%234ade80" /></svg>') 9 9, auto !important;
}
a, button, input, textarea, [cursor="pointer"] {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M0,0 v5 h2 v-3 h3 v-2 h-5 z M18,0 v5 h-2 v-3 h-3 v-2 h5 z M0,18 v-5 h2 v3 h3 v2 h-5 z M18,18 v-5 h-2 v3 h-3 v2 h5 z" fill="%234ade80" /><rect x="7" y="7" width="4" height="4" fill="%234ade80" /></svg>') 9 9, pointer !important;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
  border-left: 1px solid rgba(34, 197, 94, 0.2);
}

::-webkit-scrollbar-thumb {
  background-color: #14532d;
  border: 1px solid #22c55e;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #22c55e;
}

.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.2)
  );
  background-size: 100% 4px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

::selection {
  background: rgba(34, 197, 94, 0.4);
  color: #fff;
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Button Hover Effect (Blink then Solid) */
@keyframes btn-glitch {
  0%   { background-color: rgba(34, 197, 94, 0.5); border-color: #4ade80; box-shadow: none; }
  25%  { background-color: transparent; border-color: transparent; box-shadow: none; }
  50%  { background-color: rgba(34, 197, 94, 0.5); border-color: #4ade80; box-shadow: none; }
  75%  { background-color: transparent; border-color: transparent; box-shadow: none; }
  100% { background-color: rgba(34, 197, 94, 0.2); border-color: #4ade80; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
}

.hover-blink:hover {
  animation: btn-glitch 0.3s forwards step-end;
}
.click-blink {
  animation: btn-glitch 0.4s forwards step-end;
}
.hover-blink:hover,
.hover-blink:hover * {
  color: #4ade80 !important; /* Force text to bright green */
}

/* Glitch Effect for text */
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch::before {
  left: 2px;
  text-shadow: -1px 0 red;
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim 2s infinite linear alternate-reverse;
}
.glitch::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim 2.5s infinite linear alternate-reverse;
}
@keyframes glitch-anim {
  0% { clip: rect(72px, 9999px, 83px, 0); }
  20% { clip: rect(10px, 9999px, 81px, 0); }
  40% { clip: rect(31px, 9999px, 15px, 0); }
  60% { clip: rect(48px, 9999px, 7px, 0); }
  80% { clip: rect(93px, 9999px, 53px, 0); }
  100% { clip: rect(15px, 9999px, 2px, 0); }
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-dialog {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-leave-active .modal-dialog {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-dialog {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(10px);
}

.modal-leave-to .modal-dialog {
  opacity: 0;
  transform: translateY(-20px) scale(1.05);
}

.animate-modal-item {
  animation: slideUpFade 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(15px);
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
