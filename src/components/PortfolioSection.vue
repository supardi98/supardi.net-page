<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAudio } from '../composables/useAudio'
import { Terminal } from 'lucide-vue-next'

const emit = defineEmits(['dialog-toggled'])

const { playTypingSound, playClickSound } = useAudio()

const portfolioSectionRef = ref(null)
const isLoadingPortfolios = ref(true)
const portfolios = ref([])
const selectedPortfolio = ref(null)
const clickedPortfolioId = ref(null)
let pObserver = null
let lastScrollY = 0

const fetchPortfolios = async () => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1000))
      portfolios.value = [
        { id: 1, title: 'sys_ecommerce.exe', displayTitle: '', desc: 'Executing commerce protocols...', displayDesc: '', fullDesc: 'A comprehensive e-commerce platform built from scratch. Features include real-time inventory tracking, secure payment gateways, and a custom admin dashboard for order management.', tech: ['Vue 3', 'Tailwind', 'Cloudflare D1', 'Stripe API'], image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', imageGrid: Array(48).fill(true) },
        { id: 2, title: 'admin_panel.sh', displayTitle: '', desc: 'Root access dashboard interface.', displayDesc: '', fullDesc: 'Internal tooling interface designed for system administrators. Provides data visualization, user access control, and live server health monitoring.', tech: ['Nuxt.js', 'Chart.js', 'WebSockets', 'PostgreSQL'], image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', imageGrid: Array(48).fill(true) },
        { id: 3, title: 'social_node.js', displayTitle: '', desc: 'P2P network communication layer.', displayDesc: '', fullDesc: 'A decentralized social media prototype emphasizing user privacy and data ownership. Implements peer-to-peer message passing and encrypted local storage.', tech: ['Node.js', 'WebRTC', 'IndexedDB', 'Express'], image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80', imageGrid: Array(48).fill(true) },
      ]
    } else {
      const res = await fetch('/api/portfolios')
      const data = await res.json()
      portfolios.value = data.map(item => ({
        ...item,
        displayTitle: '',
        displayDesc: '',
        imageGrid: Array(48).fill(true)
      }))
    }
  } catch (e) {
    console.error('Failed to fetch portfolios', e)
  } finally {
    isLoadingPortfolios.value = false
  }
}

const decryptChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!'

const animatePortfolios = (reverse = false) => {
  const animateItem = (idx) => {
    if (idx >= portfolios.value.length || idx < 0) return;
    const item = portfolios.value[idx];
    
    let iteration = 0;
    if (item.animInterval) clearInterval(item.animInterval)
    item.animInterval = setInterval(() => {
      item.displayTitle = item.title.split('').map((char, i) => {
        if (char === ' ') return ' '
        if (i < iteration) return item.title[i]
        return decryptChars[Math.floor(Math.random() * decryptChars.length)]
      }).join('')
      
      item.displayDesc = item.desc.split('').map((char, i) => {
        if (char === ' ') return ' '
        if (i < iteration) return item.desc[i]
        return decryptChars[Math.floor(Math.random() * decryptChars.length)]
      }).join('')
      
      if (iteration % 2 === 0) playTypingSound();

      let blocksToClear = 4;
      while(blocksToClear > 0) {
        const visibleBlocks = item.imageGrid.map((v, i) => v ? i : -1).filter(i => i !== -1);
        if (visibleBlocks.length === 0) break;
        const randomBlock = visibleBlocks[Math.floor(Math.random() * visibleBlocks.length)];
        item.imageGrid[randomBlock] = false;
        blocksToClear--;
      }
      
      if (iteration > Math.max(item.title.length, item.desc.length)) {
        clearInterval(item.animInterval)
        item.displayTitle = item.title
        item.displayDesc = item.desc
        item.imageGrid = Array(48).fill(false) 
        
        animateItem(reverse ? idx - 1 : idx + 1)
      }
      iteration += 1
    }, 25)
  }
  
  animateItem(reverse ? portfolios.value.length - 1 : 0)
}

const resetPortfolios = () => {
  portfolios.value.forEach(item => {
    if (item.animInterval) clearInterval(item.animInterval)
    item.displayTitle = ''
    item.displayDesc = ''
    item.imageGrid = Array(48).fill(true)
  })
}

const handlePortfolioClick = (item) => {
  clickedPortfolioId.value = item.id
  setTimeout(() => {
    openDialog(item)
    clickedPortfolioId.value = null
  }, 400)
}

const openDialog = (item) => {
  selectedPortfolio.value = item
}

const closeDialog = () => {
  playClickSound()
  selectedPortfolio.value = null
}

watch(selectedPortfolio, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    emit('dialog-toggled', true)
  } else {
    document.body.style.overflow = ''
    emit('dialog-toggled', false)
  }
})

onMounted(() => {
  fetchPortfolios()
  
  if (portfolioSectionRef.value) {
    pObserver = new IntersectionObserver((entries) => {
      const currentScrollY = window.scrollY
      const isScrollingUp = currentScrollY < lastScrollY
      lastScrollY = currentScrollY

      if (entries[0].isIntersecting) {
        animatePortfolios(isScrollingUp)
      } else {
        resetPortfolios()
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -25% 0px' })
    pObserver.observe(portfolioSectionRef.value)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (pObserver && portfolioSectionRef.value) {
    pObserver.unobserve(portfolioSectionRef.value)
  }
})
</script>

<template>
  <div id="portfolio" ref="portfolioSectionRef" class="w-full max-w-4xl scroll-mt-20">
    <div class="flex items-center gap-3 mb-8 border-b border-green-500/30 pb-2">
      <Terminal class="w-6 h-6 text-green-500" />
      <h2 class="text-xl font-bold text-green-500 uppercase tracking-widest">/usr/bin/portfolio</h2>
    </div>

    <div v-if="isLoadingPortfolios" class="flex flex-col items-center justify-center py-20 text-green-500/50">
      <div class="animate-spin mb-4">|</div>
      <p class="text-xs tracking-widest">FETCHING DATA...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20">
      <div 
        v-for="item in portfolios" 
        :key="item.id"
        class="group border border-green-500/30 bg-black/40 hover-blink transition-colors p-4 flex flex-col relative cursor-pointer overflow-hidden"
        @click="handlePortfolioClick(item)"
      >
        <div v-if="clickedPortfolioId === item.id" class="absolute inset-0 click-blink z-10"></div>
        
        <div class="w-full h-32 md:h-40 bg-green-900/20 border border-green-900 mb-4 relative overflow-hidden">
          <img :src="item.image" :alt="item.title" class="absolute inset-0 w-full h-full object-cover grayscale-0 opacity-100 md:grayscale md:opacity-50 md:group-hover:opacity-100 md:group-hover:grayscale-0 transition-all duration-500" />
          <div class="absolute inset-0 grid grid-cols-8 grid-rows-6">
            <div 
              v-for="(block, idx) in item.imageGrid" 
              :key="idx" 
              class="bg-black transition-opacity duration-75"
              :class="{ 'opacity-100': block, 'opacity-0': !block }"
            ></div>
          </div>
          <div class="absolute inset-0 bg-green-500/10 group-hover:bg-transparent transition-colors"></div>
        </div>

        <h3 class="text-green-400 font-bold mb-2 h-6">
          <span v-if="item.displayTitle">> {{ item.displayTitle }}</span>
          <span v-if="item.displayTitle.length > 0 && item.displayTitle.length < item.title.length" class="animate-blink">_</span>
        </h3>
        <p class="text-green-700 text-xs h-16 line-clamp-3">
          {{ item.displayDesc }}<span v-if="item.displayDesc.length > 0 && item.displayDesc.length < item.desc.length" class="animate-blink">_</span>
        </p>

        <div class="mt-auto pt-4 flex justify-between items-center border-t border-green-900">
          <span class="text-[9px] text-green-500/50">STATUS: COMPILED</span>
          <span class="text-[9px] text-green-400 group-hover:text-green-300 group-hover:animate-pulse">[ EXECUTE ]</span>
        </div>
      </div>
    </div>

    <!-- Portfolio Detail Dialog -->
    <transition name="modal">
      <div v-if="selectedPortfolio" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer" @click.stop="closeDialog"></div>
        
        <!-- Modal Content -->
        <div class="modal-dialog relative w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col max-h-[90vh]" @click.stop>
          
          <!-- Terminal Header -->
          <div class="w-full h-8 bg-green-900/30 border-b border-green-500/50 flex items-center justify-between px-3 shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-green-400 font-mono uppercase tracking-widest">VIEWER // {{ selectedPortfolio.title }}</span>
            </div>
            <button @click="closeDialog" class="text-green-500 hover:text-white hover:bg-red-600 px-2 text-sm font-bold transition-colors">
              X
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto overflow-x-hidden">
            <img :src="selectedPortfolio.image" :alt="selectedPortfolio.title" class="animate-modal-item [animation-delay:100ms] w-full h-48 md:h-64 object-cover border border-green-900 mb-6 transition-all duration-500" />
            
            <h2 class="animate-modal-item [animation-delay:200ms] text-2xl font-bold text-green-400 mb-2">> {{ selectedPortfolio.title }}</h2>
            <p class="animate-modal-item [animation-delay:300ms] text-green-700 text-sm font-mono mb-6 leading-relaxed">{{ selectedPortfolio.fullDesc }}</p>
            
            <div class="animate-modal-item [animation-delay:400ms]">
              <div class="mb-2 text-green-500 text-xs uppercase tracking-widest border-b border-green-900 pb-1">> STACK_TRACE</div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span v-for="(tech, idx) in selectedPortfolio.tech" :key="idx" class="px-2 py-1 border border-green-800 bg-green-900/20 text-[10px] text-green-400">
                  {{ tech }}
                </span>
              </div>
            </div>
            
          </div>
          
          <!-- Footer -->
          <div class="p-4 border-t border-green-900/50 flex justify-end shrink-0">
             <button @click="closeDialog" class="px-6 py-2 border border-green-500 text-green-500 font-bold tracking-widest text-xs hover-blink">
               [ CLOSE ]
             </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
