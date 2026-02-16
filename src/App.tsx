import { useState, useEffect } from 'react'
import { useGeolocation } from './hooks/useGeolocation'
import { useReverseGeocode } from './hooks/useReverseGeocode'
import { LocationCard } from './components/LocationCard'
import { MapEmbed } from './components/MapEmbed'
import styles from './App.module.css'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

type AppStep = 'ready' | 'locating' | 'geocoding' | 'done'

export default function App() {
  const [step, setStep] = useState<AppStep>('ready')

  const geo = useGeolocation()
  const rev = useReverseGeocode()

  const missingKey = !API_KEY || API_KEY.trim() === ''

  // ✅ Auto-detect on mount
  useEffect(() => {
    if (!missingKey) {
      geo.getLocation()
    }
  }, [])

  // When location is obtained, trigger geocoding
  useEffect(() => {
    if (geo.latitude !== null && geo.longitude !== null && !geo.loading && API_KEY) {
      setStep('geocoding')
      rev.geocode(geo.latitude, geo.longitude, API_KEY)
    }
  }, [geo.latitude, geo.longitude, geo.loading])

  // When geocoding completes
  useEffect(() => {
    if (rev.address !== null && !rev.loading) {
      setStep('done')
    }
  }, [rev.address, rev.loading])

  useEffect(() => {
    if (geo.loading) setStep('locating')
  }, [geo.loading])

  useEffect(() => {
    if (rev.loading) setStep('geocoding')
  }, [rev.loading])

  const error = geo.error || rev.error

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>⊕</div>
            <span className={styles.logoText}>WHERE<span className={styles.logoAccent}>AM</span>I</span>
          </div>
          <div className={styles.statusBadge} data-active={step === 'done'}>
            <span className={styles.statusDot} />
            {step === 'done' ? 'LOCATED' : step === 'locating' ? 'LOCATING...' : step === 'geocoding' ? 'RESOLVING...' : 'STANDBY'}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>

          {missingKey && (
            <div className={styles.envWarning}>
              <span className={styles.errorIcon}>⚠</span>
              <div>
                <strong>VITE_GOOGLE_MAPS_API_KEY</strong> is not set.<br />
                Create a <code>.env</code> file in the project root with:<br />
                <code>VITE_GOOGLE_MAPS_API_KEY=AIzaSy...</code>
              </div>
            </div>
          )}

          <div className={styles.content}>

            {/* ✅ Loading indicator instead of button */}
            {(step === 'locating' || step === 'geocoding') && (
              <div className={styles.loadingState}>
                <span className={styles.spinner} />
                {step === 'locating' ? 'ACQUIRING GPS...' : 'RESOLVING ADDRESS...'}
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'done' && rev.address && geo.latitude !== null && geo.longitude !== null && (
              <div className={styles.results}>
                <LocationCard
                  address={rev.address}
                  latitude={geo.latitude}
                  longitude={geo.longitude}
                  accuracy={geo.accuracy!}
                />
                <MapEmbed
                  latitude={geo.latitude}
                  longitude={geo.longitude}
                  apiKey={API_KEY!}
                />
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <span>WHEREAMI — Google Maps Geocoding API</span>
        <span className={styles.footerDivider}>|</span>
        <span>Coordinates via browser Geolocation API</span>
      </footer>
    </div>
  )
}