import { log } from 'console'
import React, { useEffect, useRef, useState } from 'react'

interface chars {
    position: {x: number, y: number}
    velocity: {x: number, y: number}
}


const Canvas = () => {
    const [c, setC] = useState<CanvasRenderingContext2D | null>(null)
    const [canvasWidth, setCanvasWidth] = useState<number>()
    const [canvasHeight, setCanvasHeight] = useState<number>()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        canvas.width = 1024
        canvas.height = 576
        const ctx = canvas?.getContext('2d')
        ctx?.fillRect(0, 0, canvas?.width, canvas?.height)
        setC(ctx)
        setCanvasWidth(1024)
        setCanvasHeight(576)
    }, [])


    function Sprite(this: any, c: CanvasRenderingContext2D, position: chars, velocity: chars ) {
        this.c = c
        this.position = position
        this.velocity = velocity
        

        this.draw = () => {
            if (!c) return
            c.fillStyle = 'red'
            c.fillRect(this.position.x, this.position.y, 50, 150)
        }

        this.update = () => {
            this.draw()
            this.position.y += 10
        }

    }

    
    const player = new (Sprite as any)(
        c,
        {
            x: 0,
            y: 0
        },
        {
            
        }
    )

    const enemy = new (Sprite as any)(
        c,
        {
            x: 400,
            y: 100
        }
    )


    function animate() {
        window.requestAnimationFrame(animate)
        if(!c) return
        c.fillStyle = 'black'
        c?.fillRect(0, 0, 1024, 576)       
        player.update()
        enemy.update()        
    }

    animate()

    return (
        <canvas
            ref={canvasRef}
            width="1024"
            height="576"
        />
    )
}


export default Canvas
