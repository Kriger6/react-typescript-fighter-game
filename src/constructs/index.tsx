import { CANVAS_HEIGHT, GRAVITY, FighterChars, SpriteChars } from "../component/canvas"
export function Sprite(this: any, { position, imgSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }: SpriteChars) {
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
    }
    this.image.src = this.imgSrc

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
    { velocity, color, isAttacking, sprites, attackBox = { offset: {x: 0, y: 0}, width: undefined, height: undefined } }: FighterChars,
    { position, imgSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }: SpriteChars,
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
        offset: {x: attackBox.offset.x, y: attackBox.offset.y},
        width: attackBox.width,
        height: attackBox.height
    }
    this.color = color
    this.isAttacking = isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.dead = false

    for (const sprite in this.sprites) {
        sprites[sprite].image = new Image()
        sprites[sprite].image.src = sprites[sprite].imgSrc
    }


    Sprite.call(this, { position, imgSrc, scale, framesMax, offset })


    this.attack = () => {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    this.takesHit = () => {
        this.health -= 20
        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takesHit')
        }
    }

    this.switchSprite = (sprite: any) => {
        if (this.image.src === this.sprites.death.imgSrc) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true
            }
            return  
        } 

        if (this.image.src === this.sprites.takesHit.imgSrc && this.framesCurrent < this.sprites.takesHit.framesMax - 1) return

        if (this.image.src === this.sprites.attack1.imgSrc && this.framesCurrent < this.sprites.attack1.framesMax - 1) return
        switch (sprite) {
            case 'idle':
                if (this.image.src !== this.sprites.idle.imgSrc) {
                    this.image.src = this.sprites.idle.imgSrc
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'run':
                if ((this.image.src !== this.sprites.run.imgSrc
                    && this.image.src !== this.sprites.jump.imgSrc
                    && this.image.src !== this.sprites.fall.imgSrc)
                    ||
                    (this.position.y === 330 && this.image.src !== this.sprites.run.imgSrc)) {
                    this.image.src = this.sprites.run.imgSrc
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'jump':
                if (this.image.src !== this.sprites.jump.imgSrc) {
                    this.image.src = this.sprites.jump.imgSrc
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if (this.image.src !== this.sprites.fall.imgSrc && this.position.y !== 330) {
                    this.image.src = this.sprites.fall.imgSrc
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'attack1':
                if (this.image.src !== this.sprites.attack1.imgSrc) {
                    this.image.src = this.sprites.attack1.imgSrc
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'takesHit':
                if (this.image.src !== this.sprites.takesHit.imgSrc) {
                    this.image.src = this.sprites.takesHit.imgSrc
                    this.framesMax = this.sprites.takesHit.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'death':
                if (this.image.src !== this.sprites.death.imgSrc) {
                    this.image.src = this.sprites.death.imgSrc
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break;
        }
    }

    this.update = () => {
        this.draw()

        if (this.dead !== true) {
            this.animateFrames()
        }



        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


        if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT - 97) {
            this.velocity.y = 0
            this.position.y = 330

        } else this.velocity.y += GRAVITY
    }
}