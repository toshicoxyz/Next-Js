'use client'

import Image from 'next/image'
import { useState } from 'react'

import Mp3Player from './Mp3Player'

export default function Home() {
  const [state, setState] = useState(0)

  const audio = new Audio()
  audio.src = `Confident.mp3`
  audio.controls = false
  audio.loop = false
  audio.autoplay = false

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <input
        type="file"
        className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100"
      />
      <button
        className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full 
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100"
        onClick={() => audio.play()}
      >
        play
      </button>
      {/* <Mp3Player></Mp3Player> */}
    </main>
  )
}
