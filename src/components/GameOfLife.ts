import { CanvasResizer } from './CanvasResizer'
import { Dragging } from './Dagging'
import { Universe } from './Universe'

export class GameOfLife {

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    universe: Universe
    resizer: CanvasResizer
    paused = true
    lastIteration = Date.now()

    cellsize = 20
    offsetX: number
    offsetY: number

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        this.resizer = new CanvasResizer(canvas)

        this.universe = new Universe(
            Math.ceil(this.resizer.height / this.cellsize),
            Math.ceil(this.resizer.width / this.cellsize)
        )

        this.calcOffset()

        this.resizer.on(() => {
            this.universe.resize(
                Math.ceil(this.resizer.height / this.cellsize),
                Math.ceil(this.resizer.width / this.cellsize)
            )

            this.calcOffset()
        })

        const dragging = new Dragging(this.canvas)

        dragging.on((e: MouseEvent) => {
            const x = Math.ceil((e.offsetX - this.cellsize + this.offsetX) / this.cellsize)
            const y = Math.ceil((e.offsetY - this.cellsize + this.offsetY) / this.cellsize)

            if( x < 0 || y < 0 ){
                return;
            }

            if( e.buttons == 2 ){
                this.universe.unliveCell({ x, y })
            }else{
                this.universe.enliveCell({ x, y })
            }
        })

        requestAnimationFrame(() => this.draw())
    }

    play(){
        this.paused = false
    }

    pause(){
        this.paused = true
    }

    iterate(){
        if( (Date.now() - this.lastIteration) > 200 ){
            this.universe.iterate()

            this.lastIteration = Date.now()
        }
    }

    clear(){
        this.universe.clear()
    }

    calcOffset(){
        this.offsetY = Math.round((this.cellsize - (this.resizer.height % this.cellsize)) / 2) - 1
        this.offsetX = Math.round((this.cellsize - (this.resizer.width % this.cellsize)) / 2) - 1
    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = '#E12D39'

        this.universe.getLivingCells().forEach(point => {
            this.ctx.fillRect(
                point.x * this.cellsize + 2 - this.offsetX,
                point.y * this.cellsize + 2 - this.offsetY,
                this.cellsize - 4,
                this.cellsize - 4
            )
        })

        if( !this.paused ){
            this.iterate()
        }

        requestAnimationFrame(() => this.draw())
    }

}