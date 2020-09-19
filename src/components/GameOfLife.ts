import { fromEvent, Observable, merge } from 'rxjs'
import { concatMap, takeUntil, map, mergeMap } from 'rxjs/operators'
import { Universe } from './Universe'

const CELLSIZE = 20
const MAPSIZE = 30

export class GameOfLife {

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    universe: Universe
    paused = true
    lastIteration = Date.now()

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        this.canvas.width = CELLSIZE * MAPSIZE
        this.canvas.height = CELLSIZE * MAPSIZE

        this.universe = new Universe(MAPSIZE)

        const mapPoint = e => ({
            x: e.offsetX,
            y: e.offsetY
        })

        const mousedown$ = fromEvent(this.canvas, 'mousedown') as Observable<MouseEvent>
        const mousemove$ = fromEvent(this.canvas, 'mousemove') as Observable<MouseEvent>
        const mouseup$ = fromEvent(window, 'mouseup') as Observable<MouseEvent>

        const paint$ = merge(
            mousedown$.pipe(
                map(mapPoint)
            ),
            mousedown$.pipe(
                mergeMap(() => mousemove$.pipe(
                    takeUntil(mouseup$)
                )),
                map(mapPoint)
            )
        )

        paint$.subscribe(e => {
            const x = Math.ceil((e.x - CELLSIZE) / CELLSIZE)
            const y = Math.ceil((e.y - CELLSIZE) / CELLSIZE)

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
                point.x * CELLSIZE + 2,
                point.y * CELLSIZE + 2,
                CELLSIZE - 4,
                CELLSIZE - 4
            )
        })

        if( !this.paused ){
            this.iterate()
        }

        requestAnimationFrame(() => this.draw())
    }

}