import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

type Status =
  | { state: 'checking' }
  | { state: 'ok' }
  | { state: 'error'; message: string }

export default function App() {
  const [status, setStatus] = useState<Status>({ state: 'checking' })

  useEffect(() => {
    // Ping léger : on interroge l'auth, disponible même sans table créée.
    // Confirme que l'URL + la clé anon ciblent bien le projet caona.
    supabase.auth
      .getSession()
      .then(({ error }) => {
        if (error) setStatus({ state: 'error', message: error.message })
        else setStatus({ state: 'ok' })
      })
      .catch((err: unknown) =>
        setStatus({
          state: 'error',
          message: err instanceof Error ? err.message : String(err),
        }),
      )
  }, [])

  return (
    <main className="app">
      <h1>BAM</h1>
      <p className="tagline">Site web — Vite + React + TypeScript</p>

      <section className="card">
        <h2>Connexion Supabase</h2>
        <p className="project">
          Projet <strong>caona</strong>
          <span className="ref">irtjefebunphenlyuvhl</span>
        </p>
        {status.state === 'checking' && (
          <p className="status checking">Vérification en cours…</p>
        )}
        {status.state === 'ok' && (
          <p className="status ok">✓ Client connecté au projet</p>
        )}
        {status.state === 'error' && (
          <p className="status error">✗ {status.message}</p>
        )}
      </section>
    </main>
  )
}
