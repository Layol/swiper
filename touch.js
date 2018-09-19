export class TouchDiy {
    constructor(el, opt) {
        const defaultOpt = {
            events: ['swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'],
            //区分上下左右的角度(与水平方向的夹角)
            deg: 45,
            //触发的滑动距离
            distance: 30,
            //swipe触发方式touchmove|touchend
            trigger: 'move'
        }
        this.opt = Object.assign(defaultOpt, opt)
        this.el = el
        //注册事件集合
        this.evts = {}
        this.startPos = { x: 0, y: 0 }
        this.endPos = { x: 0, y: 0 }
        this.delta = { x: 0, y: 0 }
        //开始接触屏幕
        this.flagStart = false
        //处于滑动过程中
        this.flagMove = false
        this.init()
        this.bind()
    }
    //新建事件对象
    init() {
        const evts = this.opt.events
        for (let i = 0; i < evts.length; i++) {
            this.evts[evts[i]] = new Event(evts[i], { "bubbles": true, "cancelable": true })
            // this.el.addEventListener(evts[i], this.opt[evts[i]])
        }
    }
    //绑定事件
    bind() {
        this.el.addEventListener('touchstart', e => {
            this.start(e)
        })
        this.el.addEventListener('touchmove', e => {
            this.move(e)
        })
        this.el.addEventListener('touchend', e => {
            this.end(e)
        })
    }
    //计算开始坐标
    getStartPos(e) {
        this.startPos.x = e.changedTouches[0].pageX
        this.startPos.y = e.changedTouches[0].pageY
    }
    //滑动到当前坐标
    getEndPos(e) {
        this.endPos.x = e.changedTouches[0].pageX
        this.endPos.y = e.changedTouches[0].pageY
    }
    //滑动经过的位移、方向、角度
    getDeltaPos() {
        this.delta.x = this.endPos.x - this.startPos.x
        this.delta.y = this.endPos.y - this.startPos.y
        let distance = Math.sqrt(Math.pow(this.delta.x, 2) + Math.pow(this.delta.y, 2))
        let deltaXDeg = Math.abs(Math.atan(this.delta.y / this.delta.x) * 180 / Math.PI)
        return {
            distance: distance,
            deltaXDeg: deltaXDeg
        }
    }
    //开始
    start(e) {
        this.flagStart = true
        this.getStartPos(e)
    }
    //移动
    move(e) {
        this.getEndPos(e)
        let disIntime = this.getDeltaPos()
        if (this.opt.trigger === 'move') {
            //持续滑动触发swipe||首次滑动超过指定距离
            if ((!this.flagStart && this.flagMove) || (disIntime.distance > this.opt.distance)) {
                this.flagMove = true
                this.swipe(disIntime.deltaXDeg)
            }
            this.getStartPos(e)
        }
        this.flagStart = false
    }
    //结束
    end(e) {
        this.flagMove = false
        if (this.opt.trigger === 'end') {
            //滑动后才触发swipe
            if ((disIntime.distance > this.opt.distance)) {
                this.swipe(disIntime.deltaXDeg)
            }
        }
    }
    swipe(deltaXDeg) {
        if (deltaXDeg > this.opt.deg) {
            //上下
            this.delta.y > 0 ? this.evts.swipeDown && this.el.dispatchEvent(this.evts.swipeDown) : this.evts.swipeUp && this.el.dispatchEvent(this.evts.swipeUp)
        } else {
            //左右
            this.delta.x > 0 ? this.evts.swipeRight && this.el.dispatchEvent(this.evts.swipeRight) : this.evts.swipeLeft && this.el.dispatchEvent(this.evts.swipeLeft)
        }
    }
}
