"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      console.log("[v0] beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // For debugging - log if event doesn't fire after 2 seconds
    const debugTimer = setTimeout(() => {
      if (!deferredPrompt) {
        console.log("[v0] beforeinstallprompt did not fire, showing fallback")
        // Show fallback button for iOS or if PWA criteria not met
        if (isIOSDevice) {
          setShowPrompt(true)
        }
      }
    }, 2000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      clearTimeout(debugTimer)
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS - show instructions
      if (isIOS) {
        alert(
          "To install this app on iOS:\n\n1. Tap the Share button\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add'",
        )
      }
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("[v0] App installed successfully")
        setShowPrompt(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error("[v0] Installation error:", error)
    }
  }

  if (isInstalled) return null

  return (
    <Button
      onClick={handleInstall}
      size="sm"
      className="gap-2 bg-primary hover:bg-primary/90"
      title={isIOS ? "Install app on iOS" : "Install app"}
    >
      <Download size={16} />
      <span className="hidden sm:inline">Install App</span>
    </Button>
  )
}
