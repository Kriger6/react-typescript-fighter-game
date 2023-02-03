import { CANVAS_HEIGHT, GRAVITY, FighterChars, SpriteChars } from "../component/canvas"
export function Sprite(this: any, { position, imgSrc, scale = 1, framesMax = 1 }: SpriteChars) {
    this.position = position
    this.width = 50
    this.height = 150
    this.imgSrc = imgSrc
    this.backgroundLayer = new Image()
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5

    this.draw = () => {
        this.c.drawImage(
            this.backgroundLayer,
            this.framesCurrent * (this.backgroundLayer.width / this.framesMax),
            0,
            this.backgroundLayer.width / this.framesMax,
            this.backgroundLayer.height,
            this.position.x,
            this.position.y,
            (this.backgroundLayer.width / this.framesMax) * this.scale,
            this.backgroundLayer.height * this.scale)
        this.backgroundLayer.src = this.imgSrc
    }

    this.update = () => {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
        this.draw()
    }
}

export function Fighter(this: any, { position, velocity, color, isAttacking, offset }: FighterChars, lastKey: string) {
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

        if (!this.c) return
        this.c.fillStyle = this.color
        this.c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking) {
            this.c.fillStyle = 'green'
            this.c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
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


        if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT - 97) {
            this.velocity.y = 0

        } else this.velocity.y += GRAVITY
    }
}