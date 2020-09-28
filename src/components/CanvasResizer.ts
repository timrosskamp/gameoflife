export class CanvasResizer {
    canvas: HTMLCanvasElement

    width: number
    height: number

    private listeners: Function[] = []

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas

        this.update()

        window.addEventListener('resize', () => {
            this.update()
            this.emit()
        }, {
            passive: true
        })
    }

    update(){
        this.width = this.canvas.clientWidth
        this.height = this.canvas.clientHeight

        this.canvas.width = this.width
        this.canvas.height = this.height
    }

    on(fn: Function){
        this.listeners.push(fn)
    }

    private emit(){
        this.listeners.forEach(fn => fn())
    }
}