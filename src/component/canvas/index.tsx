import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import HealthBar from '../healt_bar'
import { Sprite, Fighter } from '../../constructs'
import background_layer_1 from '../../assets/background/background_layer_1.png'

export interface SpriteChars {
    position: { x: number, y: number }
    imgSrc: string
}

export interface FighterChars {
    position: { x: number, y: number }
    velocity: { x: number, y: number }
    color: string
    isAttacking: boolean
    offset: { x: number, y: number }
}
export const CANVAS_HEIGHT: number = 576
export const GRAVITY: number = 0.7

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
    const [enemyHealth, setEnemyHealth] = useState<number>(100)
    const [playerHealth, setPlayerHealth] = useState<number>(100)
    const [time, setTime] = useState<number>(60)
    const [gameOverDisplay, setGameOverDisplay] = useState<string>('none')
    const [gameOver, setGameOver] = useState<string | null>(null)

    const CANVAS_WIDTH: number = 1024

    const timerRef = useRef<any>()
    const onLoadRef = useRef<boolean>(false)

    const keys: Keys = useMemo(() => ({
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
    }), [])


    const player = useMemo(() => (new (Fighter as any)({
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
    })), [])

    const enemy = useMemo(() => (new (Fighter as any)({
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
    })), [])

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    const background = useMemo(() => (new (Sprite as any)({
        position: {
            x: 0,
            y: 0
        },
        c: canvasRef.current?.getContext('2d')
    })), [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        canvas.width = 1024
        canvas.height = 576
        const ctx = canvas.getContext('2d')
        ctx?.fillRect(0, 0, canvas?.width, canvas?.height)
        contextRef.current = ctx
        onLoadRef.current = true

    }, [])

    if (onLoadRef.current === false) {
        animate()
    }

    const determineWinner = useCallback(() => {
        setGameOverDisplay('flex')
        clearInterval(timerRef.current)
        if (player.health === enemy.health) {
            setGameOver('Tie')
        } else if (player.health > enemy.health) {
            setGameOver('Player 1 wins!')
        } else if (enemy.health > player.health) {
            setGameOver('Player 2 wins!')
        }
    }, [enemy.health, player.health])

    const updateTime = useCallback(() => {
        if (time > 0) {
            timerRef.current = setInterval(() => {
                setTime(prevState => prevState - 1)
            }, 1000)
        } else if (time === 0) {
            determineWinner()
        }
    }, [time, determineWinner])

    useEffect(() => {
        updateTime()
        background.c = contextRef.current
        background.imgSrc = background_layer_1
        player.c = contextRef.current
        enemy.c = contextRef.current

        return () => clearInterval(timerRef.current)
    }, [time, updateTime, player, enemy, background])


    function rectangularCollision({ rectangle1, rectangle2 }: any) {
        return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
            rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
            rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
    }


    function animate() {
        requestAnimationFrame(animate)
        if (!contextRef.current) return
        contextRef.current.fillStyle = 'black'
        contextRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        background.update()
        player.update()
        enemy.update()


        player.velocity.x = 0
        enemy.velocity.x = 0

        if (keys?.d.pressed === true && player.lastKey === 'd') {
            player.velocity.x = 5
        } else if (keys?.a.pressed === true && player.lastKey === 'a') {
            player.velocity.x = -5
        }

        if (keys?.ArrowRight.pressed === true && enemy.lastEnemyKey === 'ArrowRight') {
            enemy.velocity.x = 5
        } else if (keys?.ArrowLeft.pressed === true && enemy.lastEnemyKey === 'ArrowLeft') {
            enemy.velocity.x = -5
        }

        // COLLISION DETECTION

        if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
            player.isAttacking) {
            player.isAttacking = false
            enemy.health -= 20
            setEnemyHealth(prevState => prevState - 20)

        }
        if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
            enemy.isAttacking) {
            enemy.isAttacking = false
            player.health -= 20
            setPlayerHealth(prevState => prevState - 20)

        }

        // End game based on health
        if (player.health === 0 || enemy.health === 0) {
            clearInterval(timerRef.current)
            setGameOverDisplay('flex')
            if (player.health === 0) {
                setGameOver('Player 2 wins!')
            } else if (enemy.health === 0) {
                setGameOver('Player 1 wins!')
            }
        }
    }



    const keyDown = useCallback((e: any) => {
        if (keys) {
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

        }

    }, [enemy, keys, player])


    const keyUp = useCallback((e: any) => {
        if (keys) {
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
        }
    }, [keys])

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
                <div style={{ position: 'relative', height: '30px', width: '100%' }} >
                    <HealthBar health={playerHealth} />
                </div>
                <div style={{ background: 'red', width: '100px', height: '100px', flexShrink: '0', display: 'inherit', justifyContent: 'center', alignItems: 'center' }}>
                    {time}
                </div>
                <div style={{ position: 'relative', height: '30px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <HealthBar side={0} health={enemyHealth} />
                </div>
            </div>
            <div style={{ display: `${gameOverDisplay}`, justifyContent: 'center', alignItems: 'center', color: 'white', position: 'absolute', width: '100%', height: '100%' }}>
                {gameOver}
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


