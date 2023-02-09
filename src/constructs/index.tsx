import { CANVAS_HEIGHT, GRAVITY, FighterChars, SpriteChars } from "../component/canvas"
export function Sprite(this: any, { position, imgSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0} }: SpriteChars) {
    this.position = position
    this.width = 50
    this.height = 150
    this.imgSrc = imgSrc
    this.image = new Image()
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset

    this.draw = () => {
        this.c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)
        this.image.src = this.imgSrc
    }

    this.animateFrames = () => {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    this.update = () => {
        this.draw()
        this.animateFrames()
    }
}

Sprite.prototype = {
}

export function Fighter(this: any,
    { velocity, color, isAttacking, sprites}: FighterChars,
    { position, imgSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0} }: SpriteChars,
    lastKey: string) {
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey = lastKey
    this.attackBox = {
        position: {
            x: position.x,
            y: position.y
        },
        offset,
        width: 100,
        height: 50
    }
    this.color = color
    this.isAttacking = isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites

    for (const sprite in this.sprites) {
        sprites[sprite].image = new Image()
        sprites[sprite].image.src = sprites[sprite].imgSrc 
    }


    Sprite.call(this, { position, imgSrc, scale, framesMax, offset })
    

    this.attack = () => {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }

    this.switchSprite = (sprite: any) => {
        switch(sprite) {
            case 'idle':
                if (this.image.src !== this.sprites.idle.imgSrc ) {
                    this.image.src = this.sprites.idle.imgSrc
                    this.framesMax = this.sprites.idle.framesMax
                }
                break;
            case 'run':
                if (this.image.src !== this.sprites.run.imgSrc) {
                    this.image.src = this.sprites.run.imgSrc
                }
                break;
            case 'jump':
                if (this.image.src !== this.sprites.jump.imgSrc) {
                    this.image.src = this.sprites.jump.imgSrc
                    this.framesMax = this.sprites.jump.framesMax
                }
                break;
        }
    }

    this.update = () => {
        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


        if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT - 97) {
            this.velocity.y = 0

        } else this.velocity.y += GRAVITY
    }
}