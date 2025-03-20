"use client"

import { useEffect, useState, useRef } from "react"
import { Asteroid } from "@/lib/asteroid"
import Menu from "./menu"
import GameOver from "./gameOver"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export default function Game() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [currentWord, setCurrentWord] = useState("")
  const [targetAsteroid, setTargetAsteroid] = useState<Asteroid | null>(null)
  const [muted, setMuted] = useState(false)
  const [customWords, setCustomWords] = useState<string[]>([])
  const [wordMode, setWordMode] = useState<"default" | "custom">("default")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const asteroids = useRef<Asteroid[]>([])
  const animationRef = useRef<number>(0)
  const lastSpawnTime = useRef<number>(0)
  const explosionSound = useRef<HTMLAudioElement | null>(null)
  
  const backgroundMusic = useRef<HTMLAudioElement | null>(null)

  // Default word list
  const wordsByLevel = {
    1: ["code", "type", "word", "key", "text", "fast", "game", "play", "star", "ship"],
    2: ["react", "space", "quick", "blast", "orbit", "comet", "laser", "speed", "alien", "pilot"],
    3: [
      "asteroid",
      "keyboard",
      "spaceship",
      "challenge",
      "destroy",
      "mission",
      "galaxy",
      "universe",
      "quantum",
      "velocity",
    ],
    4: [
      "javascript",
      "typescript",
      "developer",
      "interstellar",
      "constellation",
      "acceleration",
      "gravitational",
      "exploration",
      "spacecraft",
      "extraterrestrial",
    ],
    5: [
      "astrophysics",
      "interplanetary",
      "electromagnetic",
      "nanotechnology",
      "supernova",
      "hypervelocity",
      "antimatter",
      "singularity",
      "nebula",
      "wormhole",
    ],
  }

  useEffect(() => {
    // Initialize audio
    explosionSound.current = new Audio("/explosion.mp3")
    backgroundMusic.current = new Audio("/background.mp3")

    if (backgroundMusic.current) {
      backgroundMusic.current.loop = true
      backgroundMusic.current.volume = 0.3
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (backgroundMusic.current) {
        backgroundMusic.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (muted) {
      if (backgroundMusic.current) backgroundMusic.current.pause()
    } else {
      if (gameState === "playing" && backgroundMusic.current) {
        backgroundMusic.current.play().catch((e) => console.log("Audio play failed:", e))
      }
    }
  }, [muted, gameState])

  useEffect(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Start background music
    if (!muted && backgroundMusic.current) {
      backgroundMusic.current.play().catch((e) => console.log("Audio play failed:", e))
    }

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (gameState !== "playing") return

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn new asteroid - more frequent as level increases
      const spawnInterval = Math.max(2000 - level * 200, 300) // Decreases with level, min 300ms
      if (timestamp - lastSpawnTime.current > spawnInterval) {
        // Select words based on current level
        const maxWordLevel = Math.min(Math.ceil(level / 2), 5) // Cap at level 5 words
        const minWordLevel = Math.max(1, maxWordLevel - 2) // At least level 1 words
        const wordLevel = Math.floor(Math.random() * (maxWordLevel - minWordLevel + 1)) + minWordLevel

        const words =
          wordMode === "custom" && customWords.length > 0
            ? customWords
            : wordsByLevel[wordLevel as keyof typeof wordsByLevel]

        const word = words[Math.floor(Math.random() * words.length)]
        const x = Math.random() * (canvas.width - 100) + 50

        // Speed increases with level
        const baseSpeed = 0.5 + level * 0.15
        // Randomize speed slightly
        const speed = baseSpeed * (0.8 + Math.random() * 0.4)

        asteroids.current.push(new Asteroid(x, -50, word, speed))
        lastSpawnTime.current = timestamp

        // Increase spawn rate as game progresses
        if (asteroids.current.length < level + 3) {
          lastSpawnTime.current -= spawnInterval / 2 // Spawn another one sooner
        }
      }

      // Update and draw asteroids
      for (let i = asteroids.current.length - 1; i >= 0; i--) {
        const asteroid = asteroids.current[i]
        asteroid.update()
        asteroid.draw(ctx)

        // Check if asteroid reached bottom
        if (asteroid.y > canvas.height) {
          asteroids.current.splice(i, 1)
          setLives((prev) => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameState("gameOver")
              if (backgroundMusic.current) backgroundMusic.current.pause()
            }
            return newLives
          })
        }
      }

      // Draw UI
      ctx.fillStyle = "white"
      ctx.font = "20px monospace"
      ctx.fillText(`Score: ${score}`, 20, 30)
      ctx.fillText(`Level: ${level}`, 20, 60)
      ctx.fillText(`Lives: ${lives}`, 20, 90)

      // Only show what's been typed, not the full word
      if (targetAsteroid) {
        ctx.fillStyle = "#4ade80"
        ctx.fillText(`> ${currentWord}`, 20, canvas.height - 20)
      } else {
        ctx.fillText(`> ${currentWord}`, 20, canvas.height - 20)
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    // Keyboard event listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGameState("menu")
        if (backgroundMusic.current) backgroundMusic.current.pause()
        return
      }

      if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        const key = e.key.toLowerCase()


        if (!targetAsteroid) {
          // Find a new target asteroid that starts with the pressed key
          const newTarget = asteroids.current.find((a) => a.word.toLowerCase().startsWith(key) && !a.targeted)

          if (newTarget) {
            newTarget.targeted = true
            newTarget.typedLength = 1 // First letter typed
            setTargetAsteroid(newTarget)
            setCurrentWord(key)
          }
        } else {
          // Continue typing the current word
          const nextChar = targetAsteroid.word[currentWord.length]

          if (key === nextChar.toLowerCase()) {
            const newCurrentWord = currentWord + key
            setCurrentWord(newCurrentWord)

            // Update typed length in the asteroid
            targetAsteroid.typedLength = newCurrentWord.length

            // Check if word is complete
            if (newCurrentWord.length === targetAsteroid.word.length) {
              // Destroy asteroid
              const index = asteroids.current.indexOf(targetAsteroid)
              if (index !== -1) {
                asteroids.current.splice(index, 1)

                // Play explosion sound
                if (!muted && explosionSound.current) {
                  explosionSound.current.currentTime = 0
                  explosionSound.current.play().catch((e) => console.log("Audio play failed:", e))
                }

                // Update score and level - more points for longer words
                const wordScore = targetAsteroid.word.length * 10 * Math.sqrt(level)
                const newScore = score + Math.floor(wordScore)
                setScore(newScore)

                // Level up more aggressively
                if (newScore > level * 300) {
                  setLevel((prev) => prev + 1)
                }
              }

              // Reset current word and target
              setCurrentWord("")
              setTargetAsteroid(null)
            }
          } else {
            // Wrong key pressed, reset current word and target
            targetAsteroid.targeted = false
            targetAsteroid.typedLength = 0
            setCurrentWord("")
            setTargetAsteroid(null)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(animationRef.current)
      if (backgroundMusic.current) backgroundMusic.current.pause()
    }
  }, [gameState, currentWord, targetAsteroid, score, level, lives, muted, customWords, wordMode])

  const startGame = () => {
    // Reset game state
    setScore(0)
    setLevel(1)
    setLives(3)
    setCurrentWord("")
    setTargetAsteroid(null)
    asteroids.current = []
    lastSpawnTime.current = 0

    setGameState("playing")
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const loadCustomText = (text: string) => {
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 1)

    setCustomWords(words)
    setWordMode("custom")
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {gameState === "menu" && (
        <Menu onStart={startGame} onLoadCustomText={loadCustomText} wordMode={wordMode} setWordMode={setWordMode} />
      )}

      {gameState === "playing" && <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />}

      {gameState === "gameOver" && (
        <GameOver score={score} level={level} onRestart={startGame} onMenu={() => setGameState("menu")} />
      )}

      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={toggleMute}>
        {muted ? <VolumeX /> : <Volume2 />}
      </Button>
    </div>
  )
}

