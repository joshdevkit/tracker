import type { AddressDetails } from '../hooks/useReverseGeocode'
import styles from './LocationCard.module.css'

interface LocationCardProps {
  address: AddressDetails
  latitude: number
  longitude: number
  accuracy: number
}

export function LocationCard({ address, latitude, longitude, accuracy }: LocationCardProps) {
  const copyCoords = () => {
    navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
  }

  const street = [address.streetNumber, address.streetName].filter(Boolean).join(' ')
  const cityCountry = [address.city, address.country].filter(Boolean).join(', ')

  return (
    <div className={styles.card}>
      {/* Status tag */}
      <div className={styles.headline}>
        <span className={styles.tag}>LOCATION RESOLVED</span>
        <p className={styles.fullAddress}>{address.fullAddress}</p>
      </div>

      {/* Key fields */}
      <div className={styles.grid}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>STREET</span>
          <span className={styles.rowValue}>{street || '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>CITY / COUNTRY</span>
          <span className={styles.rowValue}>{cityCountry || '—'}</span>
        </div>
      </div>

      {/* Coordinates — click to copy */}
      <div className={styles.coords} onClick={copyCoords} title="Click to copy coordinates">
        <div className={styles.coordBlock}>
          <span className={styles.coordLabel}>LAT</span>
          <span className={styles.coordVal}>{latitude.toFixed(6)}°</span>
        </div>
        <div className={styles.coordDivider} />
        <div className={styles.coordBlock}>
          <span className={styles.coordLabel}>LNG</span>
          <span className={styles.coordVal}>{longitude.toFixed(6)}°</span>
        </div>
        <div className={styles.coordDivider} />
        <div className={styles.coordBlock}>
          <span className={styles.coordLabel}>±ACCURACY</span>
          <span className={styles.coordVal}>{Math.round(accuracy)} m</span>
        </div>
        <span className={styles.copyHint}>⎘ copy</span>
      </div>
    </div>
  )
}
