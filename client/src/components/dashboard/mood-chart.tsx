

import { useEffect, useRef } from "react"

export default function MoodChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the past 7 days (1-5 scale, 5 being happiest)
    const moodData = [3, 2, 4, 3, 5, 4, 3]
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Colors
    const gradientColors = {
      start: "rgba(124, 58, 237, 0.8)", // Purple
      end: "rgba(124, 58, 237, 0.1)",
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, gradientColors.start)
    gradient.addColorStop(1, gradientColors.end)

    // Chart dimensions
    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 60
    const startX = 30
    const startY = 20

    // Draw grid lines
    ctx.strokeStyle = "rgba(124, 58, 237, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = startY + chartHeight - (i * chartHeight) / 5
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(startX + chartWidth, y)
      ctx.stroke()

      // Add labels for y-axis
      ctx.fillStyle = "rgba(124, 58, 237, 0.6)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(i.toString(), startX - 5, y + 3)
    }

    // Calculate points
    const points = moodData.map((mood, index) => {
      const x = startX + index * (chartWidth / (moodData.length - 1))
      const y = startY + chartHeight - (mood * chartHeight) / 5
      return { x, y }
    })

    // Draw area under the line
    ctx.beginPath()
    ctx.moveTo(points[0].x, startY + chartHeight)
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.lineTo(points[points.length - 1].x, startY + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw the line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach((point, index) => {
      if (index > 0) {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.strokeStyle = "rgba(124, 58, 237, 1)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()
      ctx.strokeStyle = "rgba(124, 58, 237, 1)"
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Add day labels
    ctx.fillStyle = "rgba(124, 58, 237, 0.6)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    points.forEach((point, index) => {
      ctx.fillText(days[index], point.x, startY + chartHeight + 15)
    })

    // Add title
    ctx.fillStyle = "rgba(124, 58, 237, 1)"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Mood Tracking (Last 7 Days)", startX, 12)
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" />
}

