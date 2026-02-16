import { useEffect, useRef } from 'react'
import styles from './MapEmbed.module.css'

interface MapEmbedProps {
  latitude: number
  longitude: number
  apiKey: string
}

export function MapEmbed({ latitude, longitude, apiKey }: MapEmbedProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    // Load the Maps JS SDK if not already present
    const scriptId = 'google-maps-js'
    const existing = document.getElementById(scriptId)

    const initMap = () => {
      if (!mapRef.current) return

      const position = { lat: latitude, lng: longitude }

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 16,
        mapTypeId: 'roadmap',
        disableDefaultUI: false,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0f1218' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f1218' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#7a8799' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2a3a' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#161b24' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a3d55' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0e1a' }] },
          { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d4d60' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#131a24' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d1a14' }] },
          { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#161b24' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2a3545' }] },
        ],
      })

      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: 'You are here',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#00e5b0',
          fillOpacity: 1,
          strokeColor: '#0a0c10',
          strokeWeight: 3,
        },
      })

      // Accuracy circle
      new window.google.maps.Circle({
        map: mapInstanceRef.current,
        center: position,
        radius: 40,
        fillColor: '#00e5b0',
        fillOpacity: 0.08,
        strokeColor: '#00e5b0',
        strokeOpacity: 0.3,
        strokeWeight: 1,
      })
    }

    if (existing) {
      // Script already loaded
      if (window.google?.maps) {
        initMap()
      } else {
        existing.addEventListener('load', initMap)
      }
    } else {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => {
      markerRef.current?.setMap(null)
      mapInstanceRef.current = null
    }
  }, [latitude, longitude, apiKey])

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <span className={styles.dot} />
        LIVE MAP
      </div>
      <div ref={mapRef} className={styles.frame} />
      <div className={styles.corner} data-pos="tl" />
      <div className={styles.corner} data-pos="tr" />
      <div className={styles.corner} data-pos="bl" />
      <div className={styles.corner} data-pos="br" />
    </div>
  )
}