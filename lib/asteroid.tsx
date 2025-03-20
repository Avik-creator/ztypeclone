export class Asteroid {
  x: number
  y: number
  word: string
  speed: number
  size: number
  rotation: number
  rotationSpeed: number
  targeted: boolean
  typedLength: number

  constructor(x: number, y: number, word: string, speed: number) {
    this.x = x
    this.y = y
    this.word = word
    this.speed = speed
    this.size = 30 + word.length * 3
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.02
    this.targeted = false
    this.typedLength = 0
  }

  update() {
    this.y += this.speed
    this.rotation += this.rotationSpeed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()

    // Move to asteroid position
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)

    // Generate a color based on the word length and a random hue
    const hue = (this.word.length * 20 + Math.floor(Math.random() * 30)) % 360
    const saturation = this.targeted ? 80 : 60
    const lightness = this.targeted ? 60 : 50
    const fillColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`
    const strokeColor = `hsla(${hue}, ${saturation + 10}%, ${lightness + 20}%, 0.9)`

    // Draw asteroid with rounded corners
    ctx.beginPath()
    const points = 8
    const angleStep = (Math.PI * 2) / points

    // Create more rounded asteroid using quadratic curves
    for (let i = 0; i <= points; i++) {
      const radius = this.size * (0.8 + Math.sin(i * 3) * 0.2)
      const angle = i * angleStep

      // Current point
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      // Next point (for control point calculation)
      const nextAngle = (i + 1) * angleStep
      const nextX = Math.cos(nextAngle) * radius * (0.8 + Math.sin((i + 1) * 3) * 0.2)
      const nextY = Math.sin(nextAngle) * radius * (0.8 + Math.sin((i + 1) * 3) * 0.2)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        // Control point for quadratic curve (between current and next point)
        const cpX = ((x + nextX) / 2) * 1.1
        const cpY = ((y + nextY) / 2) * 1.1

        ctx.quadraticCurveTo(cpX, cpY, nextX, nextY)
      }
    }

    ctx.closePath()

    // Add gradient fill
    const gradient = ctx.createRadialGradient(0, 0, this.size * 0.3, 0, 0, this.size)
    gradient.addColorStop(0, fillColor)
    gradient.addColorStop(1, `hsla(${(hue + 30) % 360}, ${saturation}%, ${lightness - 20}%, 0.6)`)

    // Fill and stroke
    ctx.fillStyle = gradient
    ctx.strokeStyle = this.targeted ? "#4ade80" : strokeColor
    ctx.lineWidth = 3
    ctx.shadowBlur = 10
    ctx.shadowColor = this.targeted ? "rgba(74, 222, 128, 0.6)" : `hsla(${hue}, 70%, 60%, 0.6)`
    ctx.fill()
    ctx.stroke()
    ctx.shadowBlur = 0

    // Add inner detail
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${(hue + 60) % 360}, ${saturation}%, ${lightness + 10}%, 0.4)`
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw word - only show remaining letters
    ctx.rotate(-this.rotation)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Only show remaining letters
    const remainingText = this.word.substring(this.typedLength)
    if (remainingText) {
      ctx.fillStyle = this.targeted ? "#ffffff" : "#ffffff"
      ctx.font = "bold 16px monospace"
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
      ctx.shadowBlur = 4
      ctx.fillText(remainingText, 0, 0)
      ctx.shadowBlur = 0
    }

    ctx.restore()
  }
}

