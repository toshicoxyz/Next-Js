'use client'

import Loading from '@/components/Loading'
import { useEffect, useRef } from 'react'
// import Loading from '@/components/loading'

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch('https://manzdev.github.io/codevember2017/assets/eye-tiger.mp3')
      .then(response => response.blob())
      .then(blob => {
        audioRef.current = new Audio(URL.createObjectURL(blob))
        audioRef.current.preload = 'metadata'
        audioRef.current.controls = false
        audioRef.current.loop = false
        console.log('Se cargó el audio')
      })
      .catch(error => {
        console.log('No se pudo cargar el audio:', error)
      })
  }, [])

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => console.log('Ha comenzado a reproducirse el sonido...'))
        .catch(() => console.log('No existe audio'))
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
    
      <Loading />
      <button
        className="block w-full text-sm text-slate-500"
        onClick={playAudio}
      >
        Play
      </button>

      <button
        className="block w-full text-sm text-slate-500"
        onClick={pauseAudio}
      >
        Pause
      </button>
    </main>
  )
}
