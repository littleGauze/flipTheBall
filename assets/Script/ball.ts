import Game from "./game"

const { ccclass, property } = cc._decorator

@ccclass
export default class Ball extends cc.Component {

    @property(cc.SpriteAtlas)
    balls: cc.SpriteAtlas = null

    frames: Array<cc.SpriteFrame> = []

    sprite: cc.Sprite = null

    level: number = 1
    idx: number = -1

    onLoad() {
        this.frames = this.balls.getSpriteFrames()
        this.sprite = this.getComponent(cc.Sprite)

        this.node.on('touchstart', this.nextBall, this)
    }

    onDestroy() {
        this.node.off('touchstart', this.nextBall, this)
    }

    initBall(level: number = 1) {
        this.idx = -1
        this.level = level
        this.nextBall()
    }

    nextBall(): void {
        if (Game.gameOver) return
        const getFrameIdx = () => {
            const idx: number = Math.floor(Math.random() * (this.level + 1))
            if (this.idx !== idx) return idx
            return getFrameIdx()
        }
        this.idx = getFrameIdx()
        this.sprite.spriteFrame = this.frames[this.idx]
    }
}
