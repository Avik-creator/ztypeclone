"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MenuProps {
  onStart: () => void
  onLoadCustomText: (text: string) => void
  wordMode: "default" | "custom"
  setWordMode: (mode: "default" | "custom") => void
}

export default function Menu({ onStart, onLoadCustomText, wordMode, setWordMode }: MenuProps) {
  const [customText, setCustomText] = useState("")
  const [activeTab, setActiveTab] = useState<string>("new-words")

  const handleStartGame = () => {
    onStart()
  }

  const handleLoadCustomText = () => {
    if (customText.trim()) {
      onLoadCustomText(customText)
      setWordMode("custom")
    }
  }

  const handleUseDefaultWords = () => {
    setWordMode("default")
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="relative w-full max-w-md p-8 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative">
          <h1 className="text-6xl font-bold tracking-wider mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">ZTYPE</h1>
          <p className="text-gray-400 uppercase tracking-widest text-sm">PHOBOSLAB</p>
        </div>
        
        <Tabs defaultValue="new-words" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-800 p-1">
            <TabsTrigger 
              value="new-words" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              NEW WORDS
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              SETTINGS
            </TabsTrigger>
            <TabsTrigger 
              value="load-text"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              LOAD TEXT
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-words" className="flex flex-col items-center space-y-4">
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 transition-all duration-300 shadow-lg hover:shadow-blue-900/50"
              onClick={handleStartGame}
            >
              START GAME
            </Button>
            <div className="text-center text-gray-400 text-sm mt-4 bg-gray-800/50 p-4 rounded-lg w-full">
              <p>Type the words to destroy the asteroids</p>
              <p className="mt-2">Press ESC to return to menu</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-2 bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400">Word Mode</h3>
              <div className="flex space-x-2">
                <Button
                  variant={wordMode === "default" ? "default" : "outline"}
                  onClick={handleUseDefaultWords}
                  className={`flex-1 ${
                    wordMode === "default" 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 border-0" 
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  Default Words
                </Button>
                <Button
                  variant={wordMode === "custom" ? "default" : "outline"}
                  onClick={() => setActiveTab("load-text")}
                  className={`flex-1 ${
                    wordMode === "custom" 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 border-0" 
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                  disabled={!customText.trim()}
                >
                  Custom Words
                </Button>
              </div>
            </div>
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 transition-all duration-300 shadow-lg hover:shadow-blue-900/50 mt-4"
              onClick={handleStartGame}
            >
              START GAME
            </Button>
          </TabsContent>
          
          <TabsContent value="load-text" className="space-y-4">
            <Textarea
              placeholder="Paste your own text here..."
              className="min-h-[150px] bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-500"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <Button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 transition-all duration-300"
              onClick={handleLoadCustomText} 
              disabled={!customText.trim()}
            >
              LOAD TEXT
            </Button>
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 transition-all duration-300 shadow-lg hover:shadow-blue-900/50"
              onClick={handleStartGame}
            >
              START GAME
            </Button>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8 text-gray-500 text-sm">
        <p className="flex items-center justify-center">
          <span className="text-blue-400 mr-2">●</span> 
          ZTYPE Clone - Built with Next.js 
          <span className="text-purple-400 ml-2">●</span>
        </p>
      </div>
    </div>
  )
}