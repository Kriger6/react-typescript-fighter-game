import { CANVAS_HEIGHT, GRAVITY, FighterChars, SpriteChars } from "../component/canvas"

export function Sprite(this: any, { position, imgSrc }: SpriteChars, c: CanvasRenderingContext2D) {
    this.position = position
    this.width = 50
    this.height = 150
    this.c = c
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = imgSrc
    
    this.image.onload = function () {
        console.log("d");
        
        this.c.drawImage(this.image, this.position.x, this.position.y)
    }  

    this.draw = () => {   
    }

    this.update = () => {                        
        this.draw()
    }
}

export function Fighter(this: any, { position, velocity, color, isAttacking, offset }: FighterChars, lastKey: string, c: CanvasRenderingContext2D) {
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
    this.c = c

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


        if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT) {
            this.velocity.y = 0

        } else this.velocity.y += GRAVITY
    }
}