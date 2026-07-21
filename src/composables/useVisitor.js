import { ref } from 'vue'

export function useVisitor() {
  const visitorIP = ref('DETECTING...')
  const visitorLocation = ref('LOCATING...')

  const fetchVisitorData = async () => {
    try {
      const res = await fetch('https://ip.iplocation.io/json')
      const data = await res.json()
      if (data.ip) {
        visitorIP.value = data.ip
        visitorLocation.value = `${data.city ? data.city.toUpperCase() : 'UNKNOWN'}, ${data.region ? data.region.toUpperCase() : ''} ${data.country ? data.country.toUpperCase() : ''}`
      } else {
        visitorIP.value = `104.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        visitorLocation.value = 'PROXY DETECTED'
      }
    } catch (e) {
      visitorIP.value = `104.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      visitorLocation.value = 'ENCRYPTED LOCATION'
    }
  }

  return {
    visitorIP,
    visitorLocation,
    fetchVisitorData
  }
}
