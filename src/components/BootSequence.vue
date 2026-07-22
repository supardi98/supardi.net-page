<script setup>
import { ref, onMounted } from 'vue'
import { useAudio } from '../composables/useAudio'

const props = defineProps({
  isBooting: Boolean,
  profileName: String,
  profileBio: String
})

const emit = defineEmits(['enter-system'])

const bootLogs = ref([])
const bootFinished = ref(false)
const { playTypingSound, playAudio } = useAudio()

onMounted(() => {
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
    bootFinished.value = true
    emit('enter-system')
  }, delay + 500)
})
</script>

<template>
  <div v-if="isBooting" class="fixed inset-0 z-[200] bg-black text-green-500 font-mono p-6 flex flex-col justify-center items-center">
    <div class="flex flex-col gap-1 w-full max-w-3xl mx-auto">
      <div v-for="(log, idx) in bootLogs" :key="idx" class="text-xs md:text-sm">
        {{ log }}
      </div>
      <div v-if="!bootFinished" class="animate-blink">_</div>
    </div>
  </div>
</template>
