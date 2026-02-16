import { useState } from 'react'
import styles from './ApiKeyInput.module.css'

interface ApiKeyInputProps {
  onSubmit: (key: string) => void
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.tag}>CONFIG</span>
        <h2 className={styles.title}>API Key Required</h2>
        <p className={styles.desc}>
          Enter your Google Maps API key to enable reverse geocoding.<br />
          The key is stored only in memory and never sent anywhere except Google's servers.
        </p>
      </div>

      <div className={styles.inputRow}>
        <div className={styles.inputWrapper}>
          <span className={styles.prefix}>›_</span>
          <input
            className={styles.input}
            type={show ? 'text' : 'password'}
            placeholder="AIza..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className={styles.toggle}
            onClick={() => setShow(s => !s)}
            title={show ? 'Hide' : 'Show'}
          >
            {show ? '◉' : '◎'}
          </button>
        </div>
        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          CONFIRM
        </button>
      </div>

      <div className={styles.hint}>
        <span className={styles.hintIcon}>ℹ</span>
        Needs <strong>Maps JavaScript API</strong>, <strong>Geocoding API</strong>, and <strong>Maps Embed API</strong> enabled.
      </div>
    </div>
  )
}
