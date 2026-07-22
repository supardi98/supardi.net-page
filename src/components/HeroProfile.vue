<script setup>
import { ref, markRaw, onMounted } from 'vue'
import { Globe, Instagram, Github, Mail, Terminal, MessageCircle } from 'lucide-vue-next'
import { useVisitor } from '../composables/useVisitor'

const props = defineProps({
  profile: Object,
  displayedName: String,
  displayedBio: String
})

const { visitorIP, visitorLocation, fetchVisitorData } = useVisitor()

const iconMap = {
  Terminal: markRaw(Terminal),
  Instagram: markRaw(Instagram),
  Github: markRaw(Github),
  Mail: markRaw(Mail),
  MessageCircle: markRaw(MessageCircle),
  Globe: markRaw(Globe)
}

const links = ref([])
const isLoadingLinks = ref(true)

const fetchLinks = async () => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 500))
      links.value = [
        { id: 1, title: 'My Portfolio', url: '#portfolio', icon: iconMap['Terminal'] },
        { id: 2, title: '@supardi._', url: 'https://instagram.com/supardi._', icon: iconMap['Instagram'] },
        { id: 3, title: 'supardi98', url: 'https://github.com/supardi98', icon: iconMap['Github'] },
        { id: 4, title: 'contact@supardi.net', url: 'mailto:contact@supardi.net', icon: iconMap['Mail'] },
        { id: 5, title: '6287728864687', url: 'https://wa.me/6287728864687', icon: iconMap['MessageCircle'] },
      ]
    } else {
      const res = await fetch('/api/links')
      const data = await res.json()
      links.value = data.map(item => ({
        ...item,
        icon: iconMap[item.icon] || iconMap['Globe']
      }))
    }
  } catch (e) {
    console.error('Failed to fetch links', e)
  } finally {
    isLoadingLinks.value = false
  }
}

const clickedLinkId = ref(null)

const handleLinkClick = async (link) => {
  clickedLinkId.value = link.id
  trackClick(link)
  
  setTimeout(() => {
    if (link.url.startsWith('#')) {
      const el = document.querySelector(link.url)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.location.hash = link.url
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
    clickedLinkId.value = null
  }, 400)
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

onMounted(() => {
  fetchVisitorData()
  fetchLinks()
})
</script>

<template>
  <div class="w-full max-w-md flex flex-col items-start border border-green-500/40 bg-black/40 backdrop-blur-md p-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] relative">
    
    <!-- Visitor Tracker -->
    <div class="absolute -top-12 right-0 text-[9px] text-green-500/50 flex flex-col items-end">
      <span class="animate-pulse mb-1">TRACKING: ACTIVE</span>
      <span>YOUR IP: {{ visitorIP }}</span>
      <span>YOUR LOCATION: {{ visitorLocation }}</span>
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
    <div v-if="isLoadingLinks" class="w-full flex flex-col gap-3 items-center justify-center py-6 text-green-500/50 text-xs">
      <div class="animate-spin mb-2">|</div>
      <span>FETCHING LINKS...</span>
    </div>
    <div v-else class="w-full flex flex-col gap-3">
      <a 
        v-for="link in links" 
        :key="link.id" 
        :href="link.url"
        @click.prevent="handleLinkClick(link)"
        class="group w-full flex items-center gap-3 p-3 border border-green-500/30 hover:border-green-500 bg-green-900/10 hover-blink transition-all duration-300 relative overflow-hidden"
      >
        <!-- Click Ripple Effect -->
        <div v-if="clickedLinkId === link.id" class="absolute inset-0 click-blink"></div>
        
        <component :is="link.icon" class="w-5 h-5 text-green-600 group-hover:text-green-400 shrink-0" />
        <span class="flex-1 text-sm tracking-wider transition-all duration-300 text-green-500 group-hover:text-white">{{ link.title }}</span>
      </a>
    </div>
  </div>
</template>
