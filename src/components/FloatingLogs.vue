<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const fakeLogs = [
  '[SYS] Monitoring network traffic...',
  '[SEC] Connection established from 192.168.1.104',
  '[OP] Bypassing firewall protocols...',
  '[WARN] Unauthorized access attempt detected.',
  '[SYS] Re-routing IP address...',
  '[OP] Injecting payload into memory...',
  '[SEC] Encryption key accepted.',
  '[SYS] Cleaning up access traces...',
  '[SEC] Scanning ports for vulnerabilities...',
  '[OP] Downloading restricted files...',
  '[SYS] Compiling background processes...',
  '[WARN] Ping spike detected. Compensating...',
  '[SEC] Updating local certificates...'
]

const visibleLogs = ref([{ id: 1, text: '[SYS] Initialization complete.' }])
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    if (Math.random() > 0.4) {
      const logText = fakeLogs[Math.floor(Math.random() * fakeLogs.length)]
      visibleLogs.value.push({ id: Date.now() + Math.random(), text: logText })
      // Keep only last 2 logs to avoid overflowing the box
      if (visibleLogs.value.length > 2) {
        visibleLogs.value.shift()
      }
    }
  }, 2500)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="fixed top-4 right-4 z-[100] w-max max-w-[90vw] md:max-w-[400px] px-2 py-1.5 bg-black/80 backdrop-blur-md border border-green-500/30 rounded-none pointer-events-none select-none shadow-[0_0_15px_rgba(34,197,94,0.1)]">
    <div class="flex flex-col justify-end h-[30px] overflow-hidden mask-image-bottom-to-top">
      <transition-group name="log-list" tag="div" class="flex flex-col gap-1 justify-end min-h-full relative w-full">
        <div v-for="log in visibleLogs" :key="log.id" class="text-[9px] md:text-[10px] font-mono text-green-500/80 tracking-widest leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis">
          {{ log.text }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.mask-image-bottom-to-top {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%, black 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 50%, black 100%);
}

.log-list-move,
.log-list-enter-active,
.log-list-leave-active {
  transition: all 0.3s ease;
}
.log-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.log-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.log-list-leave-active {
  position: absolute;
}
</style>
