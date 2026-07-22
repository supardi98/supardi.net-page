<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudio } from '../composables/useAudio'
import { Terminal } from 'lucide-vue-next'

const { playTypingSound } = useAudio()

const isLoadingSkills = ref(true)
const skills = ref([])
const skillsVisible = ref(false)
const skillsSectionRef = ref(null)
let skillAnimFrame = null
let observer = null
let lastScrollY = 0

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

const animateSkillNumbers = (reverse = false) => {
  if (skillAnimFrame) clearInterval(skillAnimFrame)
  skillAnimFrame = setInterval(() => {
    let activeSkill
    if (reverse) {
      activeSkill = [...skills.value].reverse().find(s => s.currentLevel < s.level)
    } else {
      activeSkill = skills.value.find(s => s.currentLevel < s.level)
    }
    
    if (activeSkill) {
      activeSkill.currentLevel += Math.floor(Math.random() * 15) + 5
      playTypingSound()
      if (activeSkill.currentLevel > activeSkill.level) {
        activeSkill.currentLevel = activeSkill.level
      }
    } else {
      clearInterval(skillAnimFrame)
      skillAnimFrame = null
    }
  }, 50) 
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

onMounted(() => {
  fetchSkills()
  
  if (skillsSectionRef.value) {
    observer = new IntersectionObserver((entries) => {
      const currentScrollY = window.scrollY
      const isScrollingUp = currentScrollY < lastScrollY
      lastScrollY = currentScrollY

      if (entries[0].isIntersecting) {
        skillsVisible.value = true
        animateSkillNumbers(isScrollingUp)
      } else {
        skillsVisible.value = false
        resetSkillNumbers()
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -25% 0px' })
    observer.observe(skillsSectionRef.value)
  }
})

onUnmounted(() => {
  if (observer && skillsSectionRef.value) {
    observer.unobserve(skillsSectionRef.value)
  }
})
</script>

<template>
  <div ref="skillsSectionRef" class="w-full max-w-4xl">
    <div class="flex items-center gap-3 mb-8 border-b border-green-500/30 pb-2">
      <Terminal class="w-6 h-6 text-green-500" />
      <h2 class="text-xl font-bold text-green-500 uppercase tracking-widest">/usr/bin/skills</h2>
    </div>

    <div v-if="isLoadingSkills" class="flex flex-col items-center justify-center py-10 text-green-500/50">
      <div class="animate-spin mb-4">|</div>
      <p class="text-xs tracking-widest">LOADING MODULES...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <div v-for="(skill, idx) in skills" :key="idx" class="flex flex-col gap-2 relative">
        <!-- Connecting line -->
        <div class="absolute -left-6 top-3 w-4 h-[1px] bg-green-900 hidden md:block"></div>
        <div class="absolute -left-6 top-3 w-[1px] h-full bg-green-900 hidden md:block" v-if="idx !== skills.length - 1 && idx !== skills.length - 2"></div>
        
        <div class="flex justify-between text-xs tracking-widest">
          <span class="text-green-400">> {{ skill.name }}</span>
          <span class="text-green-600">[{{ skill.currentLevel }}%]</span>
        </div>
        <div class="w-full h-2 bg-green-900/30 border border-green-900 overflow-hidden">
          <div 
            class="h-full bg-green-500 transition-all duration-75 ease-linear"
            :style="{ width: `${skillsVisible ? skill.currentLevel : 0}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
