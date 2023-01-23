import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'

interface Chars {
    position: { x: number, y: number }
    velocity: { x: number, y: number }
    color: string
    isAttacking: boolean
    offset: { x: number, y: number }
}

interface Keys {
    a: {
        pressed: boolean
    },
    d: {
        pressed: boolean
    },
    ArrowRight: {
        pressed: boolean
    },
    ArrowLeft: {
        pressed: boolean
    }
}

const Canvas = () => {
    const [c, setC] = useState<CanvasRenderingContext2D | null>(null)
    const CANVAS_WIDTH: number = 1024
    const CANVAS_HEIGHT: number = 576
    const GRAVITY: number = 0.7

    const keys: Keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        }
    }

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        canvas.width = 1024
        canvas.height = 576
        const ctx = canvas.getContext('2d')
        ctx?.fillRect(0, 0, canvas?.width, canvas?.height)
        setC(ctx)
    }, [])


    function Sprite(this: any, { position, velocity, color, isAttacking, offset }: Chars, lastKey: string,): void {
        this.c = c
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey = lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking = isAttacking

        this.draw = () => {
            if (!c) return
            c.fillStyle = this.color
            c.fillRect(this.position.x, this.position.y, this.width, this.height)

            if (this.isAttacking) {
                c.fillStyle = 'green'
                c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
            }
        }

        this.attack = () => {
            this.isAttacking = true
            setTimeout(() => {
                this.isAttacking = false
            }, 100);
        }

        this.update = () => {
            this.draw()

            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
            this.attackBox.position.y = this.position.y

            this.position.x += this.velocity.x
            this.position.y += this.velocity.y


            if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT) {
                this.velocity.y = 0

            } else this.velocity.y += GRAVITY
        }

    }


    const player = new (Sprite as any)(useMemo(() => ({
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'red',
        offset: {
            x: 0,
            y: 0
        }
    }), [])
    )

    const enemy = new (Sprite as any)(useMemo(() => ({
        position: {
            x: 400,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        }
    }), [])
    )

    function rectangularCollision({ rectangle1, rectangle2 }: any) {
        return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
            rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
            rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
    }

    function animate() {
        window.requestAnimationFrame(animate)
        if (!c) return
        c.fillStyle = 'black'
        c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        player.update()
        enemy.update()

        player.velocity.x = 0
        enemy.velocity.x = 0

        if (keys.d.pressed === true && player.lastKey === 'd') {
            player.velocity.x = 5
        } else if (keys.a.pressed === true && player.lastKey === 'a') {
            player.velocity.x = -5
        }

        if (keys.ArrowRight.pressed === true && enemy.lastEnemyKey === 'ArrowRight') {
            enemy.velocity.x = 5
        } else if (keys.ArrowLeft.pressed === true && enemy.lastEnemyKey === 'ArrowLeft') {
            enemy.velocity.x = -5
        }

        // COLLISION DETECTION

        if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
            player.isAttacking) {
            player.isAttacking = false
            console.log("go");

        }
        if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
            enemy.isAttacking) {
            enemy.isAttacking = false
            console.log("go");

        }


    }

    animate()

    const keyDown = useCallback((e: any) => {
        switch (e.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case 'w':
                player.velocity.y = -20
                break;
            case ' ':
                player.attack()
                break;
            case 'Enter':
                enemy.attack()
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastEnemyKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastEnemyKey = 'ArrowLeft'
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20
                break;

        }

    }, [enemy, keys.ArrowLeft, keys.ArrowRight, keys.a, keys.d, player])


    const keyUp = useCallback((e: any) => {
        switch (e.key) {
            case 'd':
                keys.d.pressed = false
                break;
            case 'a':
                keys.a.pressed = false
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break;
        }
    }, [keys.ArrowLeft, keys.ArrowRight, keys.a, keys.d])

    useEffect(() => {
        window.addEventListener('keydown', keyDown)
        window.addEventListener('keyup', keyUp)

        return () => {
            window.removeEventListener('keydown', keyDown)
            window.removeEventListener('keyup', keyUp)
        }
    }, [keyDown, keyUp])

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ position: 'absolute', display: 'flex', width: '100%', alignItems: 'center', padding: '20px' }}>
                <div style={{ background: 'yellow', width: '100%', height: '30px' }}></div>
                <div style={{ background: 'red', width: '100px', height: '100px', flexShrink: '0' }}></div>
                <div style={{position: 'relative', height: '30px', width: '100%'}}>
                    <div style={{ background: 'yellow', height: '30px' }}></div>
                    <div style={{ background: 'blue', position: 'absolute', top: '0', left: '0', right: '0', bottom: '0'}}></div>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                width="1024"
                height="576"
            />
        </div>
    )
}


export default Canvas
