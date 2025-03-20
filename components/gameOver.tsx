"use client"

import { Button } from "@/components/ui/button"

interface GameOverProps {
  score: number
  level: number
  onRestart: () => void
  onMenu: () => void
}

export default function GameOver({ score, level, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-80 text-white">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-xl text-center">
        <h2 className="text-4xl font-bold mb-6">GAME OVER</h2>

        <div className="space-y-2 mb-8">
          <p className="text-2xl">
            Final Score: <span className="font-bold">{score}</span>
          </p>
          <p className="text-xl">
            Level Reached: <span className="font-bold">{level}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {level < 3
              ? "Keep practicing!"
              : level < 5
                ? "Good job!"
                : level < 8
                  ? "Impressive!"
                  : "You're a typing master!"}
          </p>
        </div>

        <div className="space-y-4">
          <Button className="w-full py-6 text-lg" onClick={onRestart}>
            PLAY AGAIN
          </Button>

          <Button variant="outline" className="w-full py-6 text-lg" onClick={onMenu}>
            MAIN MENU
          </Button>
        </div>
      </div>
    </div>
  )
}

