"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Sparkles, Layers, Box, Maximize2, Settings, Save, Download, Share, Play, Pause, RotateCcw, Menu, X } from "lucide-react"

export default function AppPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to Voronova Space Habitat Designer! I'm your AI assistant. How can I help you design your space habitat today?",
    },
  ])
  const [input, setInput] = useState("")
  const [features, setFeatures] = useState({
    wasteManagement: false,
    plantGrowth: false,
    solarPanels: true,
    livingQuarters: true,
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've updated the habitat design based on your request. Check the visualization panel for the new layout.",
        },
      ])
    }, 1000)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header Bar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left side - Logo only */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Voronova" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10" />
            </Link>
          </div>

          {/* Right side - Menu Button */}
          <div className="flex items-center gap-2">
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-primary/10"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Right Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-background/80 backdrop-blur-lg" onClick={toggleMenu} />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-primary/95 to-primary/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary-foreground/20">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="Voronova" width={32} height={32} className="h-8 w-8" />
                  <span className="text-lg font-bold text-primary-foreground">VORONOVA</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={toggleMenu}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 flex flex-col justify-center px-6 space-y-8">
                <Link
                  href="/"
                  className="text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <a
                  href="#features"
                  className="text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  onClick={toggleMenu}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  onClick={toggleMenu}
                >
                  How It Works
                </a>
                <Link
                  href="/app"
                  className="text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  onClick={toggleMenu}
                >
                  Prompt Now
                </Link>
                <Link
                  href="/results"
                  className="text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  onClick={toggleMenu}
                >
                  Results
                </Link>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-primary-foreground/20">
                <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg py-6">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - AI Assistant */}
        <div className="w-full lg:w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
          <div className="p-3 border-b border-border/50 bg-card/50 flex-shrink-0">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Assistant
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Chat with your habitat design helper</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-primary to-orange-500 text-primary-foreground" 
                    : "bg-muted text-foreground"
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border/50 bg-card/50 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe your habitat design..."
                className="flex-1 bg-background/50 text-sm"
              />
              <Button onClick={handleSend} size="icon" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Visualization */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Visualization Header */}
          <div className="p-3 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Box className="h-4 w-4 text-primary" />
              Interactive Habitat Visualization
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
                <Layers className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">2D View</span>
                <span className="sm:hidden">2D</span>
              </Button>
              <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
                <Maximize2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">3D View</span>
                <span className="sm:hidden">3D</span>
              </Button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 flex items-center justify-center p-3 bg-gradient-to-br from-background to-primary/5 relative overflow-hidden min-h-0">
            {/* Background stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-primary/20 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Main visualization */}
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin-slow" />
              <div className="absolute inset-6 rounded-full border-2 border-orange-500/20 animate-spin-reverse" />
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Box className="h-12 w-12 text-primary mx-auto animate-pulse" />
                  <p className="text-xs text-muted-foreground">Your space habitat design will appear here</p>
                  <p className="text-xs text-muted-foreground">Start a conversation with the AI to begin designing</p>
                </div>
              </div>

              {/* Habitat elements */}
              {features.solarPanels && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <div className="text-xs text-primary font-medium">Solar</div>
                </div>
              )}
              {features.livingQuarters && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <div className="text-xs text-primary font-medium">Living</div>
                </div>
              )}
              {features.wasteManagement && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-lg bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
                  <div className="text-xs text-orange-500 font-medium">Waste</div>
                </div>
              )}
              {features.plantGrowth && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                  <div className="text-xs text-green-500 font-medium">Plants</div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-3 border-t border-border/50 bg-card/30 backdrop-blur-sm flex-shrink-0">
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="w-full grid grid-cols-2 lg:grid-cols-3 mb-3">
                <TabsTrigger value="controls" className="text-xs">Design Controls</TabsTrigger>
                <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
                <TabsTrigger value="export" className="text-xs hidden lg:block">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="controls" className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Habitat Features</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="waste"
                          checked={features.wasteManagement}
                          onCheckedChange={(checked) => setFeatures({ ...features, wasteManagement: checked as boolean })}
                        />
                        <Label htmlFor="waste" className="text-xs cursor-pointer">
                          Waste Management
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="plant"
                          checked={features.plantGrowth}
                          onCheckedChange={(checked) => setFeatures({ ...features, plantGrowth: checked as boolean })}
                        />
                        <Label htmlFor="plant" className="text-xs cursor-pointer">
                          Plant Growth
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="solar"
                          checked={features.solarPanels}
                          onCheckedChange={(checked) => setFeatures({ ...features, solarPanels: checked as boolean })}
                        />
                        <Label htmlFor="solar" className="text-xs cursor-pointer">
                          Solar Power
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="living"
                          checked={features.livingQuarters}
                          onCheckedChange={(checked) => setFeatures({ ...features, livingQuarters: checked as boolean })}
                        />
                        <Label htmlFor="living" className="text-xs cursor-pointer">
                          Living Quarters
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Parameters</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="scale" className="text-xs text-muted-foreground">
                          Scale Factor
                        </Label>
                        <Input id="scale" type="number" defaultValue="1.0" step="0.1" className="mt-1 bg-background/50 text-xs h-8" />
                      </div>
                      <div>
                        <Label htmlFor="complexity" className="text-xs text-muted-foreground">
                          Complexity Level
                        </Label>
                        <Input id="complexity" type="range" min="1" max="10" defaultValue="5" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <div className="rounded-lg border border-border/50 bg-card/30 p-2 hover:bg-card/50 transition-colors cursor-pointer">
                    <h4 className="text-xs font-medium text-foreground mb-1">Space Station Guide</h4>
                    <p className="text-xs text-muted-foreground">Reference materials</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/30 p-2 hover:bg-card/50 transition-colors cursor-pointer">
                    <h4 className="text-xs font-medium text-foreground mb-1">Mars Blueprints</h4>
                    <p className="text-xs text-muted-foreground">Design templates</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/30 p-2 hover:bg-card/50 transition-colors cursor-pointer">
                    <h4 className="text-xs font-medium text-foreground mb-1">Standards</h4>
                    <p className="text-xs text-muted-foreground">Industry specs</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="export" className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10">
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
