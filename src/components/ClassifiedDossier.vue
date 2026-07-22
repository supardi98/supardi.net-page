<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['trigger-easter-egg'])
const tapCount = ref(0)

const sectionRef = ref(null)
const isVisible = ref(false)
let observer = null

const handleAvatarTap = () => {
  tapCount.value++
  if (tapCount.value >= 5) {
    tapCount.value = 0
    emit('trigger-easter-egg')
  }
  // reset if they don't tap again within 1 second
  setTimeout(() => {
    if (tapCount.value > 0) tapCount.value = 0
  }, 1000)
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true
    } else {
      isVisible.value = false
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' })
  
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  if (observer && sectionRef.value) observer.unobserve(sectionRef.value)
})
</script>

<template>
  <div id="dossier" ref="sectionRef" class="w-full max-w-4xl text-green-500 font-mono scroll-mt-20">
    <div class="mb-8 border-b border-red-900/50 pb-2 flex justify-between items-end">
      <h2 class="text-2xl font-bold uppercase tracking-widest flex items-center gap-2 text-red-500">
        <span class="animate-pulse">⚠</span> TOP_SECRET // DOSSIER
      </h2>
      <span class="text-xs text-red-500/50 hidden md:block uppercase">Clearance Level: 9</span>
    </div>

    <div 
      class="bg-black/80 backdrop-blur-md border border-red-900/30 p-6 md:p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)] relative overflow-hidden transition-all duration-1000"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
    >
      <!-- CRT overlay -->
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-30 mix-blend-overlay"></div>

      <!-- Classified Stamp -->
      <div class="absolute top-4 right-4 border-4 border-red-700/30 text-red-700/30 font-bold text-4xl p-2 transform rotate-12 opacity-40 pointer-events-none select-none tracking-widest z-0">
        CLASSIFIED
      </div>

      <div class="flex flex-col md:flex-row gap-8 relative z-20">
        <!-- Photo -->
        <div 
          @click="handleAvatarTap"
          class="w-32 h-40 md:w-48 md:h-64 border border-green-500/50 bg-green-900/20 relative shrink-0 flex items-center justify-center overflow-hidden grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-700 cursor-crosshair group mx-auto md:mx-0 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
        >
          <div class="absolute inset-0 scanlines opacity-50 pointer-events-none z-10"></div>
          <img src="/avatar.png" alt="Subject Photo" class="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity" />
          <div class="absolute bottom-0 w-full bg-black/90 text-[10px] text-center py-1 border-t border-green-500/30 text-green-500/50 font-bold tracking-widest z-20">SUBJECT_IMG_01</div>
        </div>

        <!-- Details -->
        <div class="flex-1 flex flex-col gap-4 text-sm md:text-base leading-relaxed text-green-400">
          <div class="grid grid-cols-3 gap-y-3 gap-x-2 border-b border-green-900/50 pb-4">
            <div class="text-green-600 font-bold">ID:</div>
            <div class="col-span-2 font-bold tracking-widest text-green-300">SUBJ-9938-X</div>
            
            <div class="text-green-600 font-bold">ALIAS:</div>
            <div class="col-span-2 group/redact cursor-crosshair w-fit"><span class="bg-green-500 text-green-500 md:group-hover/redact:bg-transparent md:group-hover/redact:text-green-300 active:bg-transparent active:text-green-300 transition-all px-1 select-none">Supardi</span></div>
            
            <div class="text-green-600 font-bold">BASE:</div>
            <div class="col-span-2 group/redact cursor-crosshair w-fit"><span class="bg-green-500 text-green-500 md:group-hover/redact:bg-transparent md:group-hover/redact:text-green-300 active:bg-transparent active:text-green-300 transition-all px-1 select-none">Cirebon, ID</span></div>
            
            <div class="text-green-600 font-bold">CLASS:</div>
            <div class="col-span-2 text-red-500 font-bold tracking-widest">FULL-STACK ENGINEER</div>
          </div>

          <div class="mt-2 text-justify">
            Subject is a highly skilled <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">Programmer</span> and <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">Founder</span> operating out of the Southeast Asian sector. 
            Intelligence indicates deep expertise in building <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">Scalable Web Applications</span>, <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">IoT Systems</span>, and complex automation architectures.
          </div>
          
          <div class="text-justify">
            Prior operations include the establishment of <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">CV. Prodev Media</span> and <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">InstagramAF</span>. 
            Currently active within <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">CV. Anabahexagon Performa</span> focusing on <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">Web & App Development</span> for <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">GIS (Geographic Information System)</span> and <span class="bg-green-500 text-green-500 md:hover:bg-transparent md:hover:text-green-300 active:bg-transparent active:text-green-300 transition-all cursor-crosshair px-1 select-none">IoT (Internet of Things)</span>.
          </div>

          <div class="text-justify mt-4 p-3 border border-red-900/30 bg-red-900/10 text-red-500/80 italic text-xs tracking-wide">
            > WARNING: Approach with caution. Subject possesses the ability to bypass standard UI constraints and deploy full-stack environments rapidly.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
