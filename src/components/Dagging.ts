export class Dragging {

    private listeners: Function[] = []

    private isDragging = false

    constructor(target: Element){
        target.addEventListener('mousedown', e => {
            this.isDragging = true

            this.emit(e)
        })

        window.addEventListener('mouseup', e => {
            this.isDragging = false
        })

        target.addEventListener('mousemove', e => {
            if( this.isDragging ){
                this.emit(e)
            }
        })
    }

    private emit(e: Event){
        this.listeners.forEach(fn => fn(e))
    }

    on(fn: Function){
        this.listeners.push(fn)
    }

}