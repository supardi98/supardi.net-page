<script setup>
import { ref } from 'vue'
import { useAudio } from '../composables/useAudio'
import { Terminal } from 'lucide-vue-next'

const { playTypingSound } = useAudio()

const contactForm = ref({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const contactState = ref('idle') // idle, initiating, ready
const contactLogs = ref([])
const contactHistory = ref([])
const contactStep = ref(0) // 0: Name, 1: Email, 2: Message, 3: Done
const currentInput = ref('')
const terminalInputRef = ref(null)
const cursorPos = ref(0)

const updateCursor = () => {
  setTimeout(() => {
    if (terminalInputRef.value) {
      cursorPos.value = terminalInputRef.value.selectionStart || 0
    }
  }, 0)
}

const handleInput = () => {
  playTypingSound()
  updateCursor()
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
    cursorPos.value = 0
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
    cursorPos.value = 0
    contactStep.value = 3
    submitContactTerminal()
  }
  
  cursorPos.value = 0
  setTimeout(() => {
    if (terminalInputRef.value) terminalInputRef.value.focus()
  }, 50)
}

const submitContactTerminal = async () => {
  isSubmitting.value = true
  contactHistory.value.push('[!] TRANSMITTING DATA TO SECURE SERVER...')
  
  try {
    if (import.meta.env.DEV) {
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
  <div class="w-full max-w-2xl relative z-20" id="contact">
    <div class="flex items-center gap-3 mb-6 border-b border-green-500/30 pb-2">
      <Terminal class="w-6 h-6 text-green-500" />
      <h2 class="text-xl font-bold text-green-500 uppercase tracking-widest">/usr/bin/mail</h2>
    </div>

    <!-- Terminal Emulation Interface -->
    <div class="w-full border border-green-500 bg-black/60 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative">
      <div class="w-full h-6 bg-green-900/40 border-b border-green-500/50 flex items-center px-2">
        <span class="text-[9px] text-green-400 font-bold uppercase tracking-widest">SENDMAIL DEMON</span>
      </div>
      
      <div class="p-4 min-h-[200px] text-sm flex flex-col font-mono" @click="focusTerminal">
        
        <div v-if="contactState === 'idle'" class="m-auto flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer" @click="initiateContact">
          <span class="animate-pulse mb-2">_</span>
          <span class="text-green-500 font-bold tracking-widest text-xs border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition-colors">
            [ INITIALIZE CONTACT PROTOCOL ]
          </span>
        </div>

        <div v-else-if="contactState === 'initiating'" class="flex flex-col gap-1">
          <div v-for="(log, idx) in contactLogs" :key="idx" class="text-green-400 text-xs">
            {{ log }}
          </div>
          <div class="animate-blink text-green-400">_</div>
        </div>

        <div v-else-if="contactState === 'ready'" class="flex flex-col flex-1 gap-2">
          
          <div class="text-green-500 text-xs border-b border-green-900 pb-2 mb-2">
            WARNING: This connection is monitored. Provide details below.
          </div>

          <!-- History -->
          <div v-for="(msg, idx) in contactHistory" :key="idx" 
               class="text-xs break-all"
               :class="msg.includes('[!]') || msg.includes('ERROR') ? 'text-red-500 font-bold animate-pulse' : 'text-green-400'">
            {{ msg }}
          </div>
          
          <!-- Input Line -->
          <div v-if="contactStep < 3 && !isSubmitting" class="flex items-center gap-2 mt-2">
            <span class="text-green-500 shrink-0">
              <template v-if="contactStep === 0">SENDER_ID (Name):</template>
              <template v-if="contactStep === 1">RETURN_ADDRESS (Email):</template>
              <template v-if="contactStep === 2">PAYLOAD (Message):</template>
            </span>
            <div class="relative flex-1 flex items-center">
              <input 
                ref="terminalInputRef"
                v-model="currentInput"
                type="text"
                class="bg-transparent border-none outline-none text-green-300 font-mono caret-transparent w-full relative z-10"
                @keydown.enter="handleTerminalEnter"
                @keyup="updateCursor"
                @click="updateCursor"
                @input="handleInput"
              />
              <span class="text-green-500 absolute top-1/2 -translate-y-1/2 pointer-events-none z-0" :style="{ left: `${cursorPos}ch` }">
                <span class="animate-blink">█</span>
              </span>
            </div>
          </div>

          <!-- Processing Indicator -->
          <div v-if="isSubmitting" class="mt-4 flex items-center gap-2 text-yellow-500">
            <span class="animate-spin">/</span>
            <span class="animate-pulse">UPLOADING ENCRYPTED PACKAGE...</span>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
