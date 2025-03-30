'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Background() {
  const [isIOSChrome, setIsIOSChrome] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Detect iOS Chrome
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase()
      setIsIOSChrome(/crios/.test(userAgent) && /iphone|ipod|ipad/.test(userAgent))
    }
  }, [])
  
  // Canvas background for iOS Chrome
  useEffect(() => {
    if (isIOSChrome && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      function resizeCanvas() {
        if (canvas && ctx) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          drawBackground()
        }
      }
      
      function drawBackground() {
        if (!ctx) return
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const img = new Image()
        img.crossOrigin = "Anonymous"
        
        img.onload = function() {
          if (!ctx) return
          
          let imgRatio = img.width / img.height
          let canvasRatio = canvas.width / canvas.height
          
          let drawWidth, drawHeight, startX, startY
          
          if (canvasRatio > imgRatio) {
            drawWidth = canvas.width
            drawHeight = canvas.width / imgRatio
            startX = 0
            startY = 0
          } else {
            drawHeight = canvas.height
            drawWidth = canvas.height * imgRatio
            startX = (canvas.width - drawWidth) / 2
            startY = 0
          }
          
          ctx.drawImage(img, startX, startY, drawWidth, drawHeight)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        img.src = '/images/stage.png'
      }
      
      window.addEventListener('resize', resizeCanvas)
      window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 300)
      })
      
      resizeCanvas()
      
      return () => {
        window.removeEventListener('resize', resizeCanvas)
        window.removeEventListener('orientationchange', () => {
          setTimeout(resizeCanvas, 300)
        })
      }
    }
  }, [isIOSChrome])
  
  return (
    <>
      {isIOSChrome ? (
        <canvas 
          ref={canvasRef} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1
          }} 
        />
      ) : (
        <div className="fixed inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/stage.png"
              alt="Background"
              fill
              priority
              style={{
                objectFit: 'cover',
                objectPosition: 'center top'
              }}
            />
            <div 
              className="absolute inset-0 bg-black/20" 
              style={{ zIndex: 1 }}
            />
          </div>
        </div>
      )}
    </>
  )
}