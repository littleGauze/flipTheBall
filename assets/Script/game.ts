const { ccclass, property } = cc._decorator
import Ball from './ball'

@ccclass
export default class Game extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null

    @property(cc.Prefab)
    ball: cc.Prefab = null

    totalLevel: number = 4
    level: number = 1
    ballsPerLine: number = 4
    maxBalls: number = 16

    gameTime: number = 30
    nowTime: number = 0

    static gameOver: boolean = true

    ballsContainer: Array<Ball> = []

    onLoad() {
        this.init()
    }

    init(): void {
        Game.gameOver = false
        this.level = 1
        this.nowTime = 0
        this.initMap()
    }

    restart(): void {
        cc.director.loadScene('game')
    }

    initMap(): void {
        for (let i = 0, cnt = this.ballsPerLine * this.level; i < cnt; i++) {
            let ballNode: cc.Node = null
            let ball: Ball = null
            if (!(ball = this.ballsContainer[i])) {
                ballNode = cc.instantiate(this.ball)
                this.node.addChild(ballNode)
                ball = ballNode.getComponent(Ball)
                this.ballsContainer.push(ball)
            }
            ball.initBall(this.level)
        }
    }

    levelUp(): void {
        this.nowTime = 0
        if (this.level < this.totalLevel) this.level++
        this.initMap()
    }

    checkOver(): boolean {
        let idx: number = -1
        for (let i = 0, len = this.ballsContainer.length; i < len; i++) {
            if (i === 0) {
                idx = this.ballsContainer[i].idx
            }
            if (this.ballsContainer[i].idx !== idx) return false
        }
        return true
    }

    update(dt) {
        if (Game.gameOver) return
        this.nowTime += dt
        const time: number = Math.floor(this.gameTime - this.nowTime)
        this.label.string = `Level: ${this.level}, ${time}s left`
        if (time <= 0) {
            Game.gameOver = true
            this.label.string = `Level: ${this.level}, GameOver!`
            setTimeout(() => this.restart(), 3000)
            return
        }

        if (this.checkOver()) {
            this.levelUp()
        }
    }
}
