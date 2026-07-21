<script setup>
import { ref, computed, markRaw, onMounted, onUnmounted } from 'vue'
import { Globe, Instagram, Github, Mail, Terminal, ChevronDown, Volume2, VolumeX, MessageCircle } from 'lucide-vue-next'

const links = ref([
  { id: 1, title: 'My Portfolio', url: '#portfolio', icon: markRaw(Terminal) },
  { id: 2, title: '@supardi._', url: 'https://instagram.com/supardi._', icon: markRaw(Instagram) },
  { id: 3, title: 'supardi98', url: 'https://github.com/supardi98', icon: markRaw(Github) },
  { id: 4, title: 'contact@supardi.net', url: 'mailto:contact@supardi.net', icon: markRaw(Mail) },
  { id: 5, title: '6287728864687', url: 'https://wa.me/6287728864687', icon: markRaw(MessageCircle) },
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
const visitorIP = ref('DETECTING...')
const visitorLocation = ref('LOCATING...')

const mouseX = ref(0)
const mouseY = ref(0)

const uptime = ref(0)
const sysTimeHex = ref('')

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

const playAudio = async () => {
  if (audioRef.value && !isPlaying.value) {
    try {
      audioRef.value.volume = 0.1
      await audioRef.value.play()
      isPlaying.value = true
    } catch (err) {
      // Autoplay blocked by browser until user interaction
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

const bootFinished = ref(false)

const enterSystem = () => {
  isBooting.value = false
  playAudio()

  const fullName = profile.value.name
  const fullBio = profile.value.bio
  
  let i = 0
  const typeName = () => {
    if (i < fullName.length) {
      displayedName.value += fullName.charAt(i)
      playTypingSound()
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
      playTypingSound()
      j++
      setTimeout(typeBio, Math.random() * 30 + 30)
    }
  }

  setTimeout(typeName, 500) // initial delay
}

onMounted(async () => {
  fetchPortfolios()
  fetchSkills()

  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    if (data.ip) {
      visitorIP.value = data.ip
      visitorLocation.value = `${data.city ? data.city.toUpperCase() : 'UNKNOWN'}, ${data.country_name ? data.country_name.toUpperCase() : 'UNKNOWN'}`
    } else {
      visitorIP.value = `104.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      visitorLocation.value = 'PROXY DETECTED'
    }
  } catch (e) {
    visitorIP.value = `104.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    visitorLocation.value = 'ENCRYPTED LOCATION'
  }

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

  // Start Uptime and Hex Clock
  setInterval(() => {
    uptime.value++
    sysTimeHex.value = '0x' + Math.floor(Date.now() / 1000).toString(16).toUpperCase()
  }, 1000)

  setTimeout(() => {
    bootFinished.value = true
  }, delay + 500)

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseover', handleGlobalMouseOver)
  document.addEventListener('click', handleGlobalClick)

  if (skillsSectionRef.value) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillsVisible.value = true
        animateSkillNumbers()
      } else {
        skillsVisible.value = false
        resetSkillNumbers()
      }
    }, { threshold: 0.2 })
    observer.observe(skillsSectionRef.value)
  }

  if (portfolioSectionRef.value) {
    const pObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animatePortfolios()
      } else {
        resetPortfolios()
      }
    }, { threshold: 0.1 })
    pObserver.observe(portfolioSectionRef.value)
  }
})

// --- Audio System ---
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

const playTone = (freq = 800, type = 'sine', duration = 0.05, vol = 0.1) => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  // Set initial volume, then fade to 0 linearly
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

const playHoverSound = () => playTone(1200, 'sine', 0.05, 0.08);
const playClickSound = () => playTone(400, 'square', 0.1, 0.15);

// Percussive tick sound for typing
const playTypingSound = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  // Rapid pitch drop creates a "click" or "tick" sound
  osc.frequency.setValueAtTime(1000 + Math.random() * 500, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.015);
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.02);
}

const handleGlobalMouseOver = (e) => {
  if (e.target && e.target.closest && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.group'))) {
    playHoverSound();
  }
}
const handleGlobalClick = (e) => {
  initAudio();
  if (e.target && e.target.closest && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.group'))) {
    playClickSound();
  }
}
// --------------------

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseover', handleGlobalMouseOver)
  document.removeEventListener('click', handleGlobalClick)
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

const portfolioSectionRef = ref(null)
const isLoadingPortfolios = ref(true)
const portfolios = ref([])

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

const animatePortfolios = () => {
  const animateItem = (idx) => {
    if (idx >= portfolios.value.length) return;
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

      // Pixel grid reveal
      let blocksToClear = 4;
      while(blocksToClear > 0) {
        const visibleBlocks = item.imageGrid.map((v, i) => v ? i : -1).filter(i => i !== -1);
        if (visibleBlocks.length === 0) break;
        const randomBlock = visibleBlocks[Math.floor(Math.random() * visibleBlocks.length)];
        item.imageGrid[randomBlock] = false;
        blocksToClear--;
      }
      
      // Wait until description has fully resolved
      if (iteration > Math.max(item.title.length, item.desc.length)) {
        clearInterval(item.animInterval)
        item.displayTitle = item.title
        item.displayDesc = item.desc
        item.imageGrid = Array(48).fill(false) // ensure all blocks are clear
        
        // Trigger next item in the sequence
        animateItem(idx + 1)
      }
      iteration += 1
    }, 25)
  }
  
  // Start the chain reaction with the first item
  animateItem(0)
}

const resetPortfolios = () => {
  portfolios.value.forEach(item => {
    if (item.animInterval) clearInterval(item.animInterval)
    item.displayTitle = ''
    item.displayDesc = ''
    item.imageGrid = Array(48).fill(true)
  })
}

const isLoadingSkills = ref(true)
const skills = ref([])

const fetchSkills = async () => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1000))
      skills.value = [
        { name: 'JavaScript / TypeScript', level: 90, currentLevel: 0 },
        { name: 'Vue.js / Nuxt', level: 85, currentLevel: 0 },
        { name: 'Tailwind CSS', level: 95, currentLevel: 0 },
        { name: 'Node.js / Express', level: 80, currentLevel: 0 },
        { name: 'Cloudflare / D1', level: 75, currentLevel: 0 },
        { name: 'Linux / Bash', level: 85, currentLevel: 0 },
      ]
    } else {
      const res = await fetch('/api/skills')
      const data = await res.json()
      skills.value = data.map(item => ({
        name: item.name,
        level: item.level,
        currentLevel: 0
      }))
    }
  } catch (e) {
    console.error('Failed to fetch skills', e)
  } finally {
    isLoadingSkills.value = false
  }
}

const skillsVisible = ref(false)
const skillsSectionRef = ref(null)

let skillAnimFrame = null

const animateSkillNumbers = () => {
  if (skillAnimFrame) clearInterval(skillAnimFrame)
  skillAnimFrame = setInterval(() => {
    const activeSkill = skills.value.find(s => s.currentLevel < s.level)
    
    if (activeSkill) {
      // Random choppy increment
      activeSkill.currentLevel += Math.floor(Math.random() * 15) + 5
      playTypingSound()
      if (activeSkill.currentLevel > activeSkill.level) {
        activeSkill.currentLevel = activeSkill.level
      }
    } else {
      // All finished
      clearInterval(skillAnimFrame)
      skillAnimFrame = null
    }
  }, 50) // Faster interval since they run sequentially
}

const resetSkillNumbers = () => {
  if (skillAnimFrame) {
    clearInterval(skillAnimFrame)
    skillAnimFrame = null
  }
  skills.value.forEach(skill => {
    skill.currentLevel = 0
  })
}

const selectedPortfolio = ref(null)
const clickedPortfolioId = ref(null)

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
  selectedPortfolio.value = null
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

const contactForm = ref({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const contactStatus = ref(null)

const contactState = ref('idle') // idle, initiating, ready
const contactLogs = ref([])
const contactHistory = ref([])
const contactStep = ref(0) // 0: Name, 1: Email, 2: Message, 3: Done

// Game State
const isGameOpen = ref(false)
const gameCanvas = ref(null)
const gameScore = ref(0)
const isGameOver = ref(false)
let gameInterval = null;
let handleGameInput = null;

const openGame = () => {
  isGameOpen.value = true
  isGameOver.value = false
  gameScore.value = 0
  setTimeout(initGame, 100) // wait for canvas to mount
}

const closeGame = () => {
  isGameOpen.value = false
  if (gameInterval) clearInterval(gameInterval);
  if (handleGameInput) {
    window.removeEventListener('keydown', handleGameInput);
    handleGameInput = null;
  }
}

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
  
  let xv = 0, yv = 0; 
  
  gameScore.value = 0;
  isGameOver.value = false;
  
  handleGameInput = (e) => {
    switch(e.key) {
      case 'ArrowLeft': case 'a': xv = -1; yv = 0; break;
      case 'ArrowUp': case 'w': xv = 0; yv = -1; break;
      case 'ArrowRight': case 'd': xv = 1; yv = 0; break;
      case 'ArrowDown': case 's': xv = 0; yv = 1; break;
    }
    // Prevent default scrolling when playing
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) > -1) {
        e.preventDefault();
    }
  }
  window.addEventListener('keydown', handleGameInput, { passive: false });
  
  const gameLoop = () => {
    if (isGameOver.value) return;
    
    px += xv;
    py += yv;
    
    if (px < 0) px = tileCountX - 1;
    if (px >= tileCountX) px = 0;
    if (py < 0) py = tileCountY - 1;
    if (py >= tileCountY) py = 0;
    
    // Ghost AI
    // Makes the ghost move much slower (only 25% chance to move per frame)
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
    if (xv === -1) mouthOffset = 1.2;
    else if (yv === -1) mouthOffset = 1.7;
    else if (yv === 1) mouthOffset = 0.7;
    
    const isOpen = (Date.now() % 300) > 150;
    if (!isOpen) {
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

const initiateContact = () => {
  contactState.value = 'initiating'
  contactLogs.value = []
  
  const logs = [
    '> executing sendmail protocol...',
    '[!] INITIATING SECURE CONNECTION...',
    '[!] ENCRYPTION KEY EXCHANGED...',
    '[!] READY FOR INPUT.'
  ]
  
  let delay = 0
  logs.forEach((log) => {
    delay += 600
    setTimeout(() => {
      contactLogs.value.push(log)
      playTypingSound()
    }, delay)
  })
  
  setTimeout(() => {
    contactState.value = 'ready'
    contactStep.value = 0
    contactHistory.value = []
    currentInput.value = ''
    setTimeout(() => {
      if (terminalInputRef.value) terminalInputRef.value.focus()
    }, 100)
  }, delay + 500)
}

const focusTerminal = () => {
  if (terminalInputRef.value) {
    terminalInputRef.value.focus()
  }
}

const handleTerminalEnter = () => {
  if (!currentInput.value.trim()) return

  if (contactStep.value === 0) {
    contactForm.value.name = currentInput.value
    contactHistory.value.push(`> SENDER_ID: ${currentInput.value}`)
    currentInput.value = ''
    contactStep.value = 1
  } else if (contactStep.value === 1) {
    if (!currentInput.value.includes('@')) {
      contactHistory.value.push(`[!] INVALID EMAIL PROTOCOL. RETRY.`)
      return
    }
    contactForm.value.email = currentInput.value
    contactHistory.value.push(`> RETURN_ADDRESS: ${currentInput.value}`)
    currentInput.value = ''
    contactStep.value = 2
  } else if (contactStep.value === 2) {
    contactForm.value.message = currentInput.value
    contactHistory.value.push(`> PAYLOAD: ${currentInput.value}`)
    currentInput.value = ''
    contactStep.value = 3
    submitContactTerminal()
  }
  
  setTimeout(() => {
    if (terminalInputRef.value) terminalInputRef.value.focus()
  }, 50)
}

const submitContactTerminal = async () => {
  isSubmitting.value = true
  contactHistory.value.push('[!] TRANSMITTING DATA TO SECURE SERVER...')
  
  try {
    if (import.meta.env.DEV) {
      // Mock API call for local development
      await new Promise(r => setTimeout(r, 1500))
      contactHistory.value.push('[TRANSMISSION SUCCESSFUL] DATA SECURED (LOCAL DEV).')
      contactForm.value = { name: '', email: '', message: '' }
    } else {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm.value)
      })
      
      if (res.ok) {
        contactHistory.value.push('[TRANSMISSION SUCCESSFUL] DATA SECURED.')
        contactForm.value = { name: '', email: '', message: '' }
      } else {
        contactHistory.value.push('[ERROR] TRANSMISSION FAILED. RETRY.')
      }
    }
  } catch (e) {
    contactHistory.value.push('[FATAL ERROR] NETWORK DISCONNECTED.')
  } finally {
    isSubmitting.value = false
    setTimeout(() => {
      contactState.value = 'idle'
    }, 5000)
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
      <audio ref="audioRef" loop autoplay>
        <source src="/music.mp3" type="audio/mpeg">
      </audio>
    </div>

    <!-- Boot Sequence Screen -->
    <div v-if="isBooting" @click="enterSystem" class="fixed inset-0 z-[200] bg-black text-green-500 font-mono p-6 flex flex-col justify-center items-center cursor-pointer">
      <div class="flex flex-col gap-1 w-full max-w-3xl mx-auto">
        <div v-for="(log, idx) in bootLogs" :key="idx" class="text-xs md:text-sm">
          {{ log }}
        </div>
        <div v-if="!bootFinished" class="animate-blink">_</div>
        
        <div v-if="bootFinished" class="w-full flex justify-center mt-12">
          <span class="text-green-500 text-sm font-bold tracking-widest uppercase animate-pulse text-center">
            [ CLICK ANYWHERE TO CONTINUE ]
          </span>
        </div>
      </div>
    </div>

    <!-- Matrix/Grid Background -->
    <div class="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#0f380f33_1px,transparent_1px),linear-gradient(to_bottom,#0f380f33_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
    
    <!-- Cursor Interactive Glow -->
    <div 
      class="fixed inset-0 pointer-events-none z-0"
      :style="{ background: `radial-gradient(circle 600px at ${mouseX}px ${mouseY}px, rgba(34, 197, 94, 0.15), transparent 80%)` }"
    ></div>
    
    <!-- CRT Scanline Effect -->
    <div class="fixed inset-0 pointer-events-none scanlines z-50"></div>

    <!-- Hero Section (Terminal Interface) -->
    <main class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      
      <div class="w-full max-w-md flex flex-col items-start border border-green-500/40 bg-black/40 backdrop-blur-md p-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] relative mt-10">
        
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
        <div class="w-full flex flex-col gap-3">
          <a 
            v-for="link in links" 
            :key="link.id" 
            :href="link.url"
            @click.prevent="handleLinkClick(link)"
            class="group flex items-center justify-between p-3 border border-green-900 bg-black/20 backdrop-blur-sm transition-all duration-200 hover-blink cursor-pointer"
            :class="{ 'animate-click-flash': clickedLinkId === link.id }"
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
            > SYSTEM STATUS: OPTIMAL // ENCRYPTION: ACTIVE // NODE: CLOUDFLARE_EDGE_ROUTER // INCOMING CONNECTION DETECTED... // PORT: 443_SECURE //
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
    <section id="portfolio" ref="portfolioSectionRef" class="w-full max-w-3xl mx-auto p-6 pt-20 relative z-10 flex flex-col">
      <div class="w-full">
        <h2 class="text-xl font-bold text-green-500 mb-8 border-b border-green-500/30 pb-2">
          > ls -la ./portfolio
        </h2>
        
        <div v-if="isLoadingPortfolios" class="w-full flex flex-col items-center justify-center py-12 border border-green-900 bg-black/40 backdrop-blur-md">
          <div class="animate-spin mb-4 text-green-500">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-green-500 font-mono text-sm animate-pulse">> ESTABLISHING DATABASE CONNECTION...</p>
          <p class="text-green-600 font-mono text-xs">> DOWNLOADING ASSETS...</p>
        </div>

        <div v-else class="w-full flex flex-col gap-6">
          <div 
            v-for="item in portfolios" 
            :key="item.id" 
            @click="handlePortfolioClick(item)"
            class="border border-green-900 bg-black/40 backdrop-blur-md hover:border-green-500 transition-colors duration-300 group cursor-pointer flex flex-col md:flex-row relative hover-blink"
            :class="{ 'animate-click-flash': clickedPortfolioId === item.id }"
          >
            <!-- Decorative corner brackets -->
            <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="w-full md:w-1/3 h-32 md:h-full bg-green-900/20 border-b md:border-b-0 md:border-r border-green-900 relative overflow-hidden">
               <img :src="item.image" :alt="item.title" class="w-full h-full object-cover opacity-40 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-300 mix-blend-screen" />
               <!-- Pixel Grid Overlay -->
               <div class="absolute inset-0 grid grid-cols-8 grid-rows-6">
                 <div 
                   v-for="(isSolid, i) in item.imageGrid" 
                   :key="i"
                   class="bg-black transition-opacity duration-[50ms]"
                   :class="isSolid ? 'opacity-100' : 'opacity-0'"
                 ></div>
               </div>
            </div>
            <div class="p-5 flex flex-col justify-center w-full md:w-2/3">
              <h3 class="text-lg font-bold text-green-500 mb-1 group-hover:text-green-400">> {{ item.displayTitle ?? item.title }}</h3>
              <p class="text-green-700 text-xs font-mono">{{ item.displayDesc ?? item.desc }}</p>
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
      
      <div v-if="isLoadingSkills" class="w-full flex flex-col items-center justify-center py-12 border border-green-900 bg-black/40 backdrop-blur-md">
        <div class="animate-spin mb-4 text-green-500">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-green-500 font-mono text-sm animate-pulse">> ANALYZING SYSTEM CAPABILITIES...</p>
      </div>

      <div v-else class="bg-black/40 backdrop-blur-md border border-green-900 p-6 flex flex-col gap-4 font-mono text-xs sm:text-sm">
        <div v-for="skill in skills" :key="skill.name" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
          <div class="w-48 text-green-400 group-hover:text-green-300 transition-colors shrink-0">
            {{ skill.name }}
          </div>
          <div class="flex-1 flex items-center gap-3">
            <div class="flex-1 h-3 bg-green-900/30 border border-green-900 relative overflow-hidden">
              <!-- Choppy animated bar width -->
              <div class="absolute top-0 left-0 h-full bg-green-500 group-hover:bg-green-400" :style="{ width: `${skill.currentLevel}%` }"></div>
            </div>
            <div class="w-10 text-right text-green-600 group-hover:text-green-400 font-bold">
              {{ skill.currentLevel }}%
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Secure Contact Section -->
    <section id="contact" class="w-full max-w-3xl mx-auto p-6 pt-20 pb-10 relative z-10 flex flex-col">
      <h2 class="text-xl font-bold text-green-500 mb-6 border-b border-green-500/30 pb-2">
        > sendmail me@supardi.net
      </h2>
      <div class="bg-black/40 backdrop-blur-md border border-green-900 p-6 flex flex-col gap-6 font-mono text-sm relative overflow-hidden min-h-[300px]">
        
        <!-- Idle State -->
        <div v-if="contactState === 'idle'" class="absolute inset-0 flex flex-col items-center justify-center z-10">
          <button @click="initiateContact" class="px-8 py-4 border border-green-500 text-green-500 font-bold tracking-widest uppercase hover-blink animate-pulse hover:animate-none">
            [ EXECUTE SENDMAIL ]
          </button>
        </div>

        <!-- Initiating Logs -->
        <div v-if="contactState !== 'idle'" class="text-green-500/70 text-xs flex flex-col gap-2 z-10">
          <span v-for="(log, idx) in contactLogs" :key="idx">{{ log }}</span>
          <span v-if="contactState === 'initiating'" class="animate-blink">_</span>
        </div>
        
        <!-- Ready State Terminal Form -->
        <div v-if="contactState === 'ready'" class="flex flex-col gap-2 relative z-10 animate-fade-in mt-4 font-mono text-sm cursor-text min-h-[150px]" @click="focusTerminal">
          
          <!-- History -->
          <div v-for="(hist, idx) in contactHistory" :key="idx" :class="hist.includes('[!]') || hist.includes('[ERROR]') || hist.includes('[FATAL') ? 'text-red-400' : (hist.includes('[TRANSMISSION SUCCESSFUL]') ? 'text-green-400 font-bold' : 'text-green-500/70')">
            {{ hist }}
          </div>
          
          <!-- Current Input Line -->
          <div v-if="contactStep < 3" class="flex items-start md:items-center gap-2 mt-2 flex-col md:flex-row">
            <span class="text-green-600 shrink-0 font-bold">
              > {{ contactStep === 0 ? 'SENDER_ID (NAME)' : (contactStep === 1 ? 'RETURN_ADDRESS (EMAIL)' : 'PAYLOAD (MESSAGE)') }}:
            </span>
            <div class="flex-1 flex items-center w-full relative">
              <input 
                ref="terminalInputRef"
                v-model="currentInput" 
                @keyup.enter="handleTerminalEnter"
                @keydown="playTypingSound"
                type="text" 
                class="bg-transparent border-none outline-none text-green-400 flex-1 min-w-0 font-mono caret-transparent z-10"
                autocomplete="off"
                spellcheck="false"
              />
              <span class="absolute text-green-500 pointer-events-none" :style="{ left: currentInput.length + 'ch' }">
                <span class="animate-blink">_</span>
              </span>
            </div>
          </div>
          
        </div>
        
        <!-- Background Decor -->
        <div class="absolute -bottom-10 -right-10 text-[10rem] text-green-900/10 pointer-events-none font-bold">@</div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-10 pt-10 pb-16 text-[10px] text-green-900 w-full text-center border-t border-green-900/30 uppercase tracking-widest z-10 relative">
      NETWORK: CLOUDFLARE_NODE // UPTIME: {{ formattedUptime }} // SYS_TIME: {{ sysTimeHex }}
    </footer>

    <!-- Scroll Progress Indicator -->
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

    <!-- Game Modal -->
    <transition name="modal">
      <div v-if="isGameOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" @click="closeGame"></div>
        <div class="relative bg-black border-2 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)] flex flex-col items-center p-4">
          
          <div class="w-full flex justify-between items-center text-green-500 font-mono mb-2 border-b border-green-500/50 pb-2">
            <span>> MICRO_PACMAN.exe</span>
            <span class="text-yellow-400">SCORE: {{ gameScore }}</span>
          </div>

          <canvas ref="gameCanvas" width="300" height="300" class="border border-green-900 bg-black"></canvas>
          
          <div v-if="isGameOver" class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 backdrop-blur-sm">
            <span class="text-red-500 font-bold text-3xl mb-2 tracking-widest uppercase animate-pulse">GAME OVER</span>
            <span class="text-yellow-400 font-mono mb-8">FINAL SCORE: {{ gameScore }}</span>
            <button @click="initGame" class="px-6 py-2 border border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-black transition-colors mb-4">
              [ RESTART ]
            </button>
            <button @click="closeGame" class="text-green-700 text-xs hover:text-green-400">
              EXIT SYSTEM
            </button>
          </div>
          
          <div class="w-full text-center text-green-700 text-[10px] font-mono mt-4 uppercase tracking-widest leading-relaxed">
            [ W A S D ] OR [ ARROWS ] TO MOVE.<br/>
            EAT <span class="text-green-500">DATA</span>. AVOID RED <span class="text-red-500">VIRUS</span>.
          </div>
        </div>
      </div>
    </transition>

    <!-- Portfolio Detail Dialog -->
    <transition name="modal">
      <div v-if="selectedPortfolio" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer" @click="closeDialog"></div>
        
        <!-- Modal Content -->
        <div class="modal-dialog relative w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col max-h-[90vh]">
          
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
            <img :src="selectedPortfolio.image" :alt="selectedPortfolio.title" class="animate-modal-item [animation-delay:100ms] w-full h-48 md:h-64 object-cover border border-green-900 mb-6 grayscale hover:grayscale-0 transition-all duration-500" />
            
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

<style>
html {
  scroll-behavior: smooth;
  background-color: #000;
}

/* Custom Cursor */
* {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M0,0 v5 h2 v-3 h3 v-2 h-5 z M18,0 v5 h-2 v-3 h-3 v-2 h5 z M0,18 v-5 h2 v3 h3 v2 h-5 z M18,18 v-5 h-2 v3 h-3 v2 h5 z" fill="%234ade80" /><rect x="8" y="8" width="2" height="2" fill="%234ade80" /></svg>') 9 9, auto !important;
}
a, button, input, textarea, [cursor="pointer"] {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M0,0 v5 h2 v-3 h3 v-2 h-5 z M18,0 v5 h-2 v-3 h-3 v-2 h5 z M0,18 v-5 h2 v3 h3 v2 h-5 z M18,18 v-5 h-2 v3 h-3 v2 h5 z" fill="%234ade80" /><rect x="7" y="7" width="4" height="4" fill="%234ade80" /></svg>') 9 9, pointer !important;
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

.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.animate-click-flash {
  animation: click-flash 0.2s step-end infinite !important;
  transition: none !important;
}

@keyframes click-flash {
  0%, 100% { opacity: 1; border-color: rgb(34 197 94); background-color: rgba(34, 197, 94, 0.2); }
  50% { opacity: 0; border-color: transparent; background-color: transparent; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
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

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Modal Vue Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  transform: scale(0.95) translateY(15px);
}

/* Modal Content Staggered Animation */
.animate-modal-item {
  opacity: 0;
  animation: modalSlideUp 0.4s ease-out forwards;
}
@keyframes modalSlideUp {
  0% { opacity: 0; transform: translateY(20px); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>
