import Cell from '../Cell'
import { Colors } from '../Colors'

export enum FigureNames {
    FIGURE = 'figure',
    KNIGHT = 'knight',
    KING = 'king',
    PAWN = 'pawn',
    QUEEN = 'queen',
    ROOK = 'rook',
    BISHOP = 'bishop',
}

export default class Figure {
    color: Colors
    logo: string
    cell: Cell
    name: FigureNames
    id: number

    constructor(color: Colors, cell: Cell) {
        this.color = color
        this.cell = cell
        this.cell.figure = this
        this.logo = ''
        this.name = FigureNames.FIGURE
        this.id = Math.random()
    }

    canMove(cell: Cell): boolean {
        if (cell.figure?.color === this.color) return false
        if (cell.figure?.name === FigureNames.KING) return false
        return true
    }

    makeMove(cell: Cell): void {}
    // moveFigure(cell: Cell): void {}
}
