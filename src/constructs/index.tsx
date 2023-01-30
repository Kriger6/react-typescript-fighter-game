import { CANVAS_HEIGHT, GRAVITY, Chars } from "../component/canvas"

export function something(this: any, { position, velocity, color, isAttacking, offset }: Chars, lastKey: string, contextRef: any) {
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
    this.health = 100

    this.draw = () => {
        if (!contextRef.current) return
        contextRef.current.fillStyle = this.color
        contextRef.current.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking) {
            contextRef.current.fillStyle = 'green'
            contextRef.current.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
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