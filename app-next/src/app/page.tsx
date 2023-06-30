'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('Confident.mp3')
    audioRef.current.controls = false
    audioRef.current.loop = false
  }, [])

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <button
        className="block w-full text-sm text-slate-500"
        onClick={playAudio}
      >
        play
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
