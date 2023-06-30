import { useEffect, useRef } from 'react'

const Mp3Player = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let audio: HTMLAudioElement
    let context: AudioContext
    let analyser: AnalyserNode
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let source: MediaElementAudioSourceNode
    let rep: boolean | null = null
    let fbc_array: Uint8Array
    let bars: number

    const frameLooper = () => {
      window.requestAnimationFrame(frameLooper)

      fbc_array = new Uint8Array(analyser.frequencyBinCount)

      analyser.getByteFrequencyData(fbc_array)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'grey'
      bars = 1000

      for (let i = 0; i < bars; i++) {
        const bar_x = i * 2
        const bar_width = 1
        const bar_height = -(fbc_array[i] / 4)
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
      }
    }

    const initMp3Player = () => {
      const audioBox = document.getElementById('audio_box') as HTMLElement
      console.log(audioBox)
      if (!audioBox) return

      audioBox.appendChild(audio)

      const playButton = document.querySelector('#Play')
      if (!playButton) return

      playButton.addEventListener('click', function () {
        if (rep === null) {
          context = new AudioContext()
          analyser = context.createAnalyser()

          canvas = document.querySelector(
            '#analyzer_render'
          ) as HTMLCanvasElement
          if (!canvas) return

          ctx = canvas.getContext('2d') as CanvasRenderingContext2D

          source = context.createMediaElementSource(audio)
          source.connect(analyser)
          analyser.connect(context.destination)
          frameLooper()
          audio.play()
          rep = true
        } else {
          audio.play()
          rep = true
        }
      })
    }

    initMp3Player()
  }, [])

  return (
    <div id="mp3_player">
      <canvas
        ref={canvasRef}
        width="1920"
        height="75"
        className="fixed opacity-50 bottom-0 bg-transparent z-[-1]"
        id="analyzer_render"
      ></canvas>
      <div id="audio_box"></div>
    </div>
  )
}

export default Mp3Player
