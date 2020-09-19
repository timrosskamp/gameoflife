interface Point {
    x: number
    y: number
}

export class Universe {

    private size: number
    private matrix: Array<Array<boolean>>

    constructor(size: number){
        this.size = size

        this.clear()
    }

    getLivingCells(){
        const cells: Point[] = []

        for( let row = 0; row < this.size; row++ ){
            for( let col = 0; col < this.size; col++ ){
                if( this.matrix[row][col] == true ){
                    cells.push({ x: col, y: row })
                }
            }
        }

        return cells
    }

    enliveCell(point: Point){
        this.matrix[point.y][point.x] = true
    }

    iterate(){
        const delta = []

        for( let row = 0; row < this.size; row++ ){
            for( let col = 0; col < this.size; col++ ){
                const state = this.matrix[row][col]
                const neighbors = this.neighbors({ x: col, y: row })

                if( state == false && neighbors == 3 ){
                    delta.push({ x: col, y: row, state: true })
                }else if( state == true && (neighbors == 2 || neighbors == 3) ){
                    delta.push({ x: col, y: row, state: true })
                }else if( state == true ){
                    delta.push({ x: col, y: row, state: false })
                }
            }
        }

        delta.forEach(point => {
            this.matrix[point.y][point.x] = point.state
        })
    }

    clear() {
        this.matrix = []

        for( let row = 0; row < this.size; row++ ){
            this.matrix[row] = []

            for( let col = 0; col < this.size; col++ ){
                this.matrix[row][col] = false
            }
        }
    }

    private neighbors(point: Point){
        let cells = 0

        for( let x = -1; x <= 1; x++ ){
            for( let y = -1; y <= 1; y++ ){
                if( x == 0 && y == 0 )
                    continue;

                if( this.matrix[this.torus(point.y + y)][this.torus(point.x + x)] )
                    cells++
            }
        }

        return cells
    }

    private torus(i: number){
        return (i + this.size) % this.size
    }

}