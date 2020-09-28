import { CanvasResizer } from './CanvasResizer'
import { Dragging } from './Dagging'
import { Universe } from './Universe'

export class GameOfLife {

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    universe: Universe
    paused = true
    lastIteration = Date.now()

    cellsize = 20

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        const resizer = new CanvasResizer(canvas)

        this.universe = new Universe(
            Math.ceil(resizer.height / this.cellsize),
            Math.ceil(resizer.width / this.cellsize)
        )

        resizer.on(() => {
            this.universe.resize(
                Math.ceil(resizer.height / this.cellsize),
                Math.ceil(resizer.width / this.cellsize)
            )
        })

        const dragging = new Dragging(this.canvas)

        dragging.on((e: MouseEvent) => {
            const x = Math.ceil((e.offsetX - this.cellsize) / this.cellsize)
            const y = Math.ceil((e.offsetY - this.cellsize) / this.cellsize)

            if( x < 0 || y < 0 ){
                return;
            }

            this.universe.enliveCell({ x, y })
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

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = '#E12D39'

        this.universe.getLivingCells().forEach(point => {
            this.ctx.fillRect(
                point.x * this.cellsize + 2,
                point.y * this.cellsize + 2,
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