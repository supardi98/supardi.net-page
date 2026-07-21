<script setup>
import { ref, markRaw, onMounted, onUnmounted } from 'vue'
import { Globe, Instagram, Github, Mail, Terminal, ChevronDown, Volume2, VolumeX } from 'lucide-vue-next'

const links = ref([
  { id: 1, title: 'My Portfolio', url: '#portfolio', icon: markRaw(Terminal) },
  { id: 2, title: '@supardi._', url: 'https://instagram.com/supardi._', icon: markRaw(Instagram) },
  { id: 3, title: 'supardi98', url: 'https://github.com/supardi98', icon: markRaw(Github) },
  { id: 4, title: 'contact@supardi.net', url: 'mailto:contact@supardi.net', icon: markRaw(Mail) },
])

const profile = ref({
  name: 'me@supardi:~#',
  bio: 'JOB: PROGRAMMER\nLOCATION: CIREBON, INDONESIA',
  image: '/avatar.png'
})

const displayedName = ref('')
const displayedBio = ref('')

const isBooting = ref(true)
const bootLogs = ref([])
const audioRef = ref(null)
const isPlaying = ref(false)
const visitorIP = ref('127.0.0.1')

const toggleAudio = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

onMounted(() => {
  visitorIP.value = `104.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

  const logs = [
    'BIOS Date 07/21/2026 19:35:21 Ver 08.11.12',
    'CPU: Quantum Core i9-9900K @ 4.80GHz',
    'Memory: 64536K OK',
    'Loading Kernel...',
    'Mounting root filesystem... [OK]',
    'Initializing secure connection...',
    'Establishing Cloudflare node...',
    'Boot complete.'
  ]
  
  let delay = 0
  logs.forEach((log) => {
    delay += Math.random() * 200 + 100
    setTimeout(() => {
      bootLogs.value.push(log)
    }, delay)
  })

  setTimeout(() => {
    isBooting.value = false
    
    // Resume original typing logic
    const fullName = profile.value.name
    const fullBio = profile.value.bio
    
    let i = 0
    const typeName = () => {
      if (i < fullName.length) {
        displayedName.value += fullName.charAt(i)
        i++
        // random typing speed
        setTimeout(typeName, Math.random() * 50 + 50)
      } else {
        setTimeout(typeBio, 300)
      }
    }

    let j = 0
    const typeBio = () => {
      if (j < fullBio.length) {
        displayedBio.value += fullBio.charAt(j)
        j++
        setTimeout(typeBio, Math.random() * 30 + 30)
      }
    }

    setTimeout(typeName, 500) // initial delay

    window.addEventListener('scroll', handleScroll)

    if (skillsSectionRef.value) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            skillsVisible.value = true
          }, 300)
          observer.disconnect()
        }
      }, { threshold: 0.2 })
      observer.observe(skillsSectionRef.value)
    }
  }, delay + 800)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

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

const portfolios = ref([
  { id: 1, title: 'sys_ecommerce.exe', desc: 'Executing commerce protocols...', fullDesc: 'A comprehensive e-commerce platform built from scratch. Features include real-time inventory tracking, secure payment gateways, and a custom admin dashboard for order management.', tech: ['Vue 3', 'Tailwind', 'Cloudflare D1', 'Stripe API'], image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80' },
  { id: 2, title: 'admin_panel.sh', desc: 'Root access dashboard interface.', fullDesc: 'Internal tooling interface designed for system administrators. Provides data visualization, user access control, and live server health monitoring.', tech: ['Nuxt.js', 'Chart.js', 'WebSockets', 'PostgreSQL'], image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80' },
  { id: 3, title: 'social_node.js', desc: 'P2P network communication layer.', fullDesc: 'A decentralized social media prototype emphasizing user privacy and data ownership. Implements peer-to-peer message passing and encrypted local storage.', tech: ['Node.js', 'WebRTC', 'IndexedDB', 'Express'], image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80' },
])

const skills = ref([
  { name: 'JavaScript / TypeScript', level: 90 },
  { name: 'Vue.js / Nuxt', level: 85 },
  { name: 'Tailwind CSS', level: 95 },
  { name: 'Node.js / Express', level: 80 },
  { name: 'Cloudflare / D1', level: 75 },
  { name: 'Linux / Bash', level: 85 },
])

const skillsVisible = ref(false)
const skillsSectionRef = ref(null)

const selectedPortfolio = ref(null)

const openDialog = (item) => {
  selectedPortfolio.value = item
}

const closeDialog = () => {
  selectedPortfolio.value = null
}

const trackClick = async (link) => {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ linkId: link.id, url: link.url })
    })
  } catch (e) {
    console.error('Failed to track click', e)
  }
}

const contactForm = ref({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const contactStatus = ref(null)

const submitContact = async () => {
  isSubmitting.value = true
  contactStatus.value = null
  
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm.value)
    })
    
    if (res.ok) {
      contactStatus.value = { success: true, message: '[TRANSMISSION SUCCESSFUL] DATA SECURED.' }
      contactForm.value = { name: '', email: '', message: '' }
    } else {
      contactStatus.value = { success: false, message: '[ERROR] TRANSMISSION FAILED. RETRY.' }
    }
  } catch (e) {
    contactStatus.value = { success: false, message: '[FATAL ERROR] NETWORK DISCONNECTED.' }
  } finally {
    isSubmitting.value = false
    setTimeout(() => { contactStatus.value = null }, 5000)
  }
}
</script>

<template>
  <div class="relative w-full min-h-screen bg-black text-green-500 font-mono overflow-x-hidden" style="cursor: crosshair">
    
    <!-- Audio Player -->
    <div class="fixed top-4 left-4 z-50">
      <button @click="toggleAudio" class="p-2 border border-green-500 bg-black/80 text-green-500 hover-blink transition-colors">
        <component :is="isPlaying ? Volume2 : VolumeX" class="w-4 h-4" />
      </button>
      <audio ref="audioRef" loop>
        <!-- Royalty free synthwave/cyberpunk track from Pixabay -->
        <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_249202755e.mp3" type="audio/mpeg">
      </audio>
    </div>

    <!-- Boot Sequence Screen -->
    <div v-if="isBooting" class="fixed inset-0 z-[200] bg-black text-green-500 font-mono p-6 flex flex-col justify-end">
      <div class="flex flex-col gap-1 w-full max-w-3xl mx-auto mb-10">
        <div v-for="(log, idx) in bootLogs" :key="idx" class="text-xs md:text-sm">
          {{ log }}
        </div>
        <div class="animate-blink">_</div>
      </div>
    </div>

    <!-- Matrix/Grid Background -->
    <div class="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#0f380f33_1px,transparent_1px),linear-gradient(to_bottom,#0f380f33_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
    
    <!-- CRT Scanline Effect -->
    <div class="fixed inset-0 pointer-events-none scanlines z-50"></div>

    <!-- Hero Section (Terminal Interface) -->
    <main class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      
      <div class="w-full max-w-md flex flex-col items-start border border-green-500/40 bg-black/90 p-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] relative mt-10">
        
        <!-- Visitor Tracker -->
        <div class="absolute -top-10 right-0 text-[9px] text-green-500/50 flex flex-col items-end">
          <span class="animate-pulse">TRACKING: ACTIVE</span>
          <span>IP_TRACE: {{ visitorIP }}</span>
        </div>

        <!-- Terminal Header Decor -->
        <div class="absolute top-0 left-0 w-full h-6 bg-green-900/30 border-b border-green-500/40 flex items-center px-2 gap-2">
          <div class="w-2 h-2 bg-green-500/50 rounded-full"></div>
          <div class="w-2 h-2 bg-green-500/50 rounded-full"></div>
          <div class="w-2 h-2 bg-green-500/50 rounded-full"></div>
          <span class="text-[10px] ml-2 text-green-500/70">bash - 80x24</span>
        </div>

        <!-- Profile Section -->
        <div class="flex items-center gap-4 mt-6 mb-6 border-b border-green-500/30 pb-6 w-full h-24">
          <img :src="profile.image" :alt="profile.name" class="w-16 h-16 border border-green-500 p-1 grayscale hover:grayscale-0 transition-all duration-300 shrink-0" />
          <div class="flex-1">
            <h1 class="text-xl font-bold text-green-400">{{ displayedName }}<span v-if="displayedName.length < profile.name.length || (displayedName.length === profile.name.length && displayedBio.length === 0)" class="animate-blink">_</span></h1>
            <pre class="text-xs text-green-700 mt-2">{{ displayedBio }}<span v-if="displayedBio.length > 0" class="animate-blink">_</span></pre>
          </div>
        </div>

        <!-- Links Section -->
        <div class="w-full flex flex-col gap-3">
          <a 
            v-for="link in links" 
            :key="link.id" 
            :href="link.url"
            :target="link.url.startsWith('#') ? '_self' : '_blank'"
            rel="noopener noreferrer"
            @click="trackClick(link)"
            class="group flex items-center justify-between p-3 border border-green-900 bg-black transition-all duration-200 hover-blink cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <component :is="link.icon" class="w-5 h-5 text-green-600 transition-colors" />
              <span class="text-sm font-semibold text-green-600 transition-colors">[{{ link.title }}]</span>
            </div>
            <span class="text-green-900 text-[10px] uppercase tracking-widest transition-colors">
              <template v-if="link.url.startsWith('#')">EXECUTE</template>
              <template v-else>CONNECT</template>
            </span>
          </a>
        </div>

        <!-- Running Text Ticker -->
        <div class="w-full mt-6 border-t border-green-500/30 pt-2 overflow-hidden bg-green-900/10 relative h-6 flex items-center">
          <div class="absolute whitespace-nowrap text-[10px] text-green-500/70 tracking-widest animate-marquee font-mono">
            > SYSTEM STATUS: OPTIMAL // ENCRYPTION: ACTIVE // NODE: CLOUDFLARE_EDGE_ROUTER // INCOMING CONNECTION DETECTED... // PORT: 443_SECURE // LOCATION: GLOBAL //
          </div>
        </div>

      </div>

      <!-- Scroll Indicator Arrow -->
      <a href="#portfolio" class="absolute bottom-8 flex flex-col items-center justify-center animate-bounce text-green-500/70 hover:text-green-400 transition-colors cursor-pointer">
        <span class="text-[10px] font-mono tracking-widest mb-1">SCROLL_DOWN</span>
        <ChevronDown class="w-6 h-6" />
      </a>
    </main>

    <!-- Portfolio Section -->
    <section id="portfolio" class="w-full max-w-3xl mx-auto p-6 pt-20 relative z-10 flex flex-col items-center">
      <div class="w-full">
        <h2 class="text-xl font-bold text-green-500 mb-8 border-b border-green-500/30 pb-2">
          > ls -la ./portfolio
        </h2>
        
        <div class="w-full flex flex-col gap-6">
          <div 
            v-for="item in portfolios" 
            :key="item.id" 
            @click="openDialog(item)"
            class="border border-green-900 bg-black/90 hover:border-green-500 transition-colors duration-300 group cursor-pointer flex flex-col md:flex-row relative"
          >
            <!-- Decorative corner brackets -->
            <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="w-full md:w-1/3 h-32 overflow-hidden border-b md:border-b-0 md:border-r border-green-900 group-hover:border-green-500">
               <img :src="item.image" :alt="item.title" class="w-full h-full object-cover opacity-40 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-300 mix-blend-screen" />
            </div>
            <div class="p-5 flex flex-col justify-center w-full md:w-2/3">
              <h3 class="text-lg font-bold text-green-500 mb-1 group-hover:text-green-400">> {{ item.title }}</h3>
              <p class="text-green-700 text-xs font-mono">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" ref="skillsSectionRef" class="w-full max-w-3xl mx-auto p-6 pt-20 relative z-10 flex flex-col">
      <h2 class="text-xl font-bold text-green-500 mb-6 border-b border-green-500/30 pb-2">
        > ./check_skills.sh
      </h2>
      <div class="bg-black/90 border border-green-900 p-6 flex flex-col gap-4 font-mono text-xs sm:text-sm">
        <div v-for="skill in skills" :key="skill.name" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
          <div class="w-48 text-green-400 group-hover:text-green-300 transition-colors shrink-0">
            {{ skill.name }}
          </div>
          <div class="flex-1 flex items-center gap-3">
            <div class="flex-1 h-3 bg-green-900/30 border border-green-900 relative overflow-hidden">
              <!-- Animated bar width -->
              <div class="absolute top-0 left-0 h-full bg-green-500 group-hover:bg-green-400 transition-all duration-1000 ease-out" :style="{ width: skillsVisible ? `${skill.level}%` : '0%' }"></div>
            </div>
            <div class="w-10 text-right text-green-600 group-hover:text-green-400 font-bold">
              {{ skillsVisible ? skill.level : 0 }}%
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Secure Contact Section -->
    <section id="contact" class="w-full max-w-3xl mx-auto p-6 pt-20 pb-10 relative z-10 flex flex-col">
      <h2 class="text-xl font-bold text-green-500 mb-6 border-b border-green-500/30 pb-2">
        > ./secure_comm.sh
      </h2>
      <div class="bg-black/90 border border-green-900 p-6 flex flex-col gap-6 font-mono text-sm relative overflow-hidden">
        <div class="text-green-500/70 text-xs flex flex-col gap-1">
          <span class="animate-pulse">[!] INITIATING SECURE CONNECTION...</span>
          <span>[!] ENCRYPTION KEY EXCHANGED.</span>
          <span>[!] WAITING FOR TRANSMISSION...</span>
        </div>
        
        <form @submit.prevent="submitContact" class="flex flex-col gap-5 relative z-10">
          <div class="flex flex-col gap-2">
            <label class="text-green-600 text-xs uppercase tracking-widest">> SENDER_ID (NAME)</label>
            <input v-model="contactForm.name" type="text" required class="bg-black/50 border border-green-900 focus:border-green-500 text-green-400 p-3 outline-none transition-colors w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-green-600 text-xs uppercase tracking-widest">> RETURN_ADDRESS (EMAIL)</label>
            <input v-model="contactForm.email" type="email" required class="bg-black/50 border border-green-900 focus:border-green-500 text-green-400 p-3 outline-none transition-colors w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-green-600 text-xs uppercase tracking-widest">> PAYLOAD (MESSAGE)</label>
            <textarea v-model="contactForm.message" rows="4" required class="bg-black/50 border border-green-900 focus:border-green-500 text-green-400 p-3 outline-none transition-colors resize-none w-full"></textarea>
          </div>
          
          <button type="submit" :disabled="isSubmitting" class="mt-4 p-4 border border-green-500 text-green-500 font-bold tracking-widest uppercase disabled:opacity-50 hover-blink">
            {{ isSubmitting ? 'TRANSMITTING...' : '[ SEND_TRANSMISSION ]' }}
          </button>
          
          <div v-if="contactStatus" :class="contactStatus.success ? 'text-green-400' : 'text-red-500'" class="text-xs text-center mt-2 animate-pulse uppercase tracking-widest font-bold">
            {{ contactStatus.message }}
          </div>
        </form>
        
        <!-- Background Decor -->
        <div class="absolute -bottom-10 -right-10 text-[10rem] text-green-900/10 pointer-events-none font-bold">@</div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-10 pt-10 pb-16 text-[10px] text-green-900 w-full text-center border-t border-green-900/30 uppercase tracking-widest z-10 relative">
      SYSTEM_OS: VUE.JS // NETWORK: CLOUDFLARE_NODE
    </footer>

    <!-- Scroll Progress Indicator (Download Style) -->
    <div class="fixed bottom-0 left-0 w-full h-8 bg-black/90 border-t border-green-500/40 z-50 flex items-center px-4 font-mono text-[10px] text-green-500 backdrop-blur-md">
      <div class="w-24 shrink-0 animate-pulse">PROGRESS</div>
      <div class="flex-1 mx-4 bg-green-900/30 h-2 border border-green-500/40 relative overflow-hidden">
        <div class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-150 ease-out" :style="{ width: `${scrollProgress}%` }"></div>
      </div>
      <div class="w-12 shrink-0 text-right">[{{ scrollProgress }}%]</div>
    </div>

    <!-- Portfolio Detail Dialog -->
    <div v-if="selectedPortfolio" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" @click="closeDialog"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-2xl bg-black border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col max-h-[90vh]">
        
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
        <div class="p-6 overflow-y-auto">
          <img :src="selectedPortfolio.image" :alt="selectedPortfolio.title" class="w-full h-48 md:h-64 object-cover border border-green-900 mb-6 grayscale hover:grayscale-0 transition-all duration-500" />
          
          <h2 class="text-2xl font-bold text-green-400 mb-2">> {{ selectedPortfolio.title }}</h2>
          <p class="text-green-700 text-sm font-mono mb-6 leading-relaxed">{{ selectedPortfolio.fullDesc }}</p>
          
          <div class="mb-2 text-green-500 text-xs uppercase tracking-widest border-b border-green-900 pb-1">> STACK_TRACE</div>
          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="(tech, idx) in selectedPortfolio.tech" :key="idx" class="px-2 py-1 border border-green-800 bg-green-900/20 text-[10px] text-green-400">
              {{ tech }}
            </span>
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

  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  background-color: #000;
}

/* Custom Cursor */
* {
  cursor: crosshair !important;
}
a, button, input, textarea, [cursor="pointer"] {
  cursor: crosshair !important;
}

/* CRT Scanline Effect */
.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2)
  );
  background-size: 100% 4px;
  pointer-events: none;
}

/* Terminal Selection Color */
::selection {
  background: rgba(34, 197, 94, 0.4);
  color: #fff;
}

/* Terminal Cursor Blink */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}

/* Running Text (Marquee) */
@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  animation: marquee 15s linear infinite;
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
.hover-blink:hover,
.hover-blink:hover * {
  color: #4ade80 !important; /* Force text to bright green */
}
</style>
