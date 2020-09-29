interface Point {
    x: number
    y: number
}

interface Delta {
    x: number
    y: number
    state: boolean
}

export class Universe {

    private rows: number
    private cols: number
    private matrix: Array<Array<boolean>>

    constructor(rows: number, cols: number){
        this.rows = rows
        this.cols = cols

        this.clear()
    }

    getLivingCells(){
        const cells: Point[] = []

        for( let row = 0; row < this.rows; row++ ){
            for( let col = 0; col < this.cols; col++ ){
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

    unliveCell(point: Point){
        this.matrix[point.y][point.x] = false
    }

    iterate(){
        const delta: Delta[] = []

        for( let row = 0; row < this.rows; row++ ){
            for( let col = 0; col < this.cols; col++ ){
                const state = this.matrix[row][col]
                const neighbors = this.neighbors({ x: col, y: row })

                if( state == true && neighbors != 2 && neighbors != 3 ){
                    delta.push({ x: col, y: row, state: false })
                }else if( state == false && neighbors == 3 ){
                    delta.push({ x: col, y: row, state: true })
                }
            }
        }

        for( const { x, y, state } of delta ){
            this.matrix[y][x] = state
        }
    }

    clear() {
        this.matrix = []

        for( let row = 0; row < this.rows; row++ ){
            this.matrix[row] = []

            for( let col = 0; col < this.cols; col++ ){
                this.matrix[row][col] = false
            }
        }
    }

    resize(rows: number, cols: number){
        if( rows !== this.rows ){
            if( rows > this.rows ){
                for( let row = this.rows; row < rows; row++ ){
                    this.matrix[row] = [];

                    for( let col = 0; col < this.cols; col++ ){
                        this.matrix[row][col] = false
                    }
                }
            }else{
                this.matrix = this.matrix.slice(0, rows)
            }

            this.rows = rows
        }

        if( cols !== this.cols ){
            if( cols > this.cols ){
                for( let row = 0; row < this.rows; row++ ){
                    for( let col = this.cols; col < cols; col++ ){
                        this.matrix[row][col] = false
                    }
                }
            }else{
                for( let row = 0; row < this.rows; row++ ){
                    this.matrix[row] = this.matrix[row].slice(0, cols)
                }
            }

            this.cols = cols
        }

    }

    private neighbors(point: Point){
        let cells = 0

        for( let x = -1; x <= 1; x++ ){
            for( let y = -1; y <= 1; y++ ){
                if( x == 0 && y == 0 )
                    continue

                if( this.matrix[this.torus(point.y + y, this.rows)][this.torus(point.x + x, this.cols)] )
                    cells++
            }
        }

        return cells
    }

    private torus(i: number, limit: number){
        return (i + limit) % limit
    }

}