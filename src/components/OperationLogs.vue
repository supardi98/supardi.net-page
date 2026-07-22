<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudio } from '../composables/useAudio'
import { Terminal } from 'lucide-vue-next'

const { playTypingSound } = useAudio()

const sectionRef = ref(null)
const logs = [
  { year: '2015-2019', role: 'Founder', company: 'InstagramAF by supardi.net', loc: 'Self Project' },
  { year: '2019-2022', role: 'Programmer', company: 'CV. Sukses Bisnis Online', loc: 'Malang' },
  { year: '2022-2025', role: 'Founder', company: 'CV. Prodev Media', loc: 'Cirebon' },
  { year: '2025-NOW', role: 'Programmer', company: 'CV. Anabahexagon Performa', loc: 'Yogyakarta' }
]

const experiences = [
  'Bot Automation Social Media & Scraping Data',
  'Dashboard Admin Panel',
  'Online Shop',
  'Point of Sale (POS) Systems',
  'Digital Restaurant Ordering Systems',
  'IoT (Internet of Things)',
  'GIS (Geographic Information System)',
  'Server Administration',
  'And other related integrations'
]

const displayedLogs = ref([])
const displayedExp = ref([])
const isVisible = ref(false)
let observer = null
let hasAnimated = false
let timers = []

const startAnimation = () => {
  if (hasAnimated) return
  hasAnimated = true
  
  let delay = 0
  logs.forEach((log) => {
    delay += 400
    const t = setTimeout(() => {
      displayedLogs.value.push(log)
      playTypingSound()
    }, delay)
    timers.push(t)
  })

  delay += 600
  experiences.forEach((exp) => {
    delay += 150
    const t = setTimeout(() => {
      displayedExp.value.push(exp)
      if (Math.random() > 0.5) playTypingSound()
    }, delay)
    timers.push(t)
  })
}

const resetAnimation = () => {
  hasAnimated = false
  isVisible.value = false
  displayedLogs.value = []
  displayedExp.value = []
  timers.forEach(t => clearTimeout(t))
  timers = []
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true
      startAnimation()
    } else {
      resetAnimation()
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -25% 0px' })
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer && sectionRef.value) observer.unobserve(sectionRef.value)
})
</script>

<template>
  <div id="experience" ref="sectionRef" class="w-full max-w-4xl text-green-500 font-mono scroll-mt-20">
    <div class="flex items-center justify-between mb-8 border-b border-green-500/30 pb-2">
      <div class="flex items-center gap-3">
        <Terminal class="w-6 h-6 text-green-500" />
        <h2 class="text-xl font-bold text-green-500 uppercase tracking-widest">/usr/bin/operation_logs</h2>
      </div>
      <span class="text-xs text-green-500/50 hidden md:block">SYS_LOG_ID: EXP-{{ new Date().getFullYear() }}</span>
    </div>

    <div class="bg-black/80 backdrop-blur-md border border-green-500/50 p-4 md:p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative overflow-hidden group">
      <!-- CRT overlay -->
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-30 mix-blend-overlay"></div>
      
      <!-- Work History -->
      <div class="mb-8 relative z-20">
        <div class="text-green-500/70 text-xs mb-6 font-bold"># QUERY: SELECT * FROM career_history ORDER BY year ASC;</div>
        
        <div class="flex flex-col gap-6">
          <div v-for="(log, idx) in displayedLogs" :key="idx" class="border-l-2 border-green-500 pl-4 py-1 relative hover-blink transition-colors hover:bg-green-900/30 cursor-crosshair">
            <div class="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-green-400 group-hover:shadow-[0_0_8px_#22c55e]"></div>
            <div class="text-xs md:text-sm text-green-400/80 mb-1">[{{ log.year }}]</div>
            <div class="text-sm md:text-lg font-bold text-green-400 transition-colors">> ROLE: {{ log.role.toUpperCase() }}</div>
            <div class="text-xs md:text-sm mt-1 text-green-300/90">@ {{ log.company }} <span class="opacity-50">// {{ log.loc }}</span></div>
            <div class="text-[10px] text-green-500/50 mt-2 uppercase tracking-widest">STATUS: EXECUTION_COMPLETE</div>
          </div>
        </div>
        <div v-if="isVisible && displayedLogs.length < logs.length" class="mt-4 text-green-500 animate-blink font-bold">_</div>
      </div>

      <!-- Experience / Capabilities -->
      <div v-if="displayedLogs.length === logs.length" class="relative z-20">
        <div class="text-green-500/70 text-xs mb-4 mt-10 pt-6 border-t border-green-900 font-bold"># QUERY: INIT_CAPABILITIES --load-all</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="(exp, idx) in displayedExp" :key="idx" class="flex items-start gap-2 text-sm md:text-base bg-green-900/20 p-3 border border-green-900/80 hover:border-green-500/50 transition-colors">
            <span class="text-green-400 font-bold">[OK]</span>
            <span class="text-green-300">{{ exp }}</span>
          </div>
        </div>
        <div v-if="displayedExp.length < experiences.length" class="mt-4 text-green-500 animate-blink font-bold text-lg">_</div>
        <div v-else class="mt-8 text-green-400 font-bold text-sm tracking-widest border border-green-500 p-2 inline-block bg-green-900/30">> ALL_SYSTEMS_OPERATIONAL.</div>
      </div>
    </div>
  </div>
</template>
