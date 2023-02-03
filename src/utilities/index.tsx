export function rectangularCollision({ rectangle1, rectangle2 }: any) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

export const determineWinner = ({setGameOverDisplay, player, setGameOver, enemy, timerRef}: any) => {    
    setGameOverDisplay('flex')
    clearInterval(timerRef.current)
    if (player.health === enemy.health) {
        setGameOver('Tie')
    } else if (player.health > enemy.health) {
        setGameOver('Player 1 wins!')
    } else if (enemy.health > player.health) {
        setGameOver('Player 2 wins!')
    }
}

export const updateTime = ({time, timerRef, setTime, determineWinner, setGameOverDisplay, player, enemy, setGameOver}: any) => {
    if (time > 0) {
        timerRef.current = setInterval(() => {
            setTime((prevState: number) => prevState - 1)
        }, 1000)
    } else if (time === 0) {
        determineWinner({setGameOverDisplay, timerRef, player, enemy, setGameOver})
    }
}