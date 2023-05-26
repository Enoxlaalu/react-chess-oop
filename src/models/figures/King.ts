import { Colors } from '../Colors'
import Figure, { FigureNames } from './Figure'
import whiteLogo from '../../assets/white-king.png'
import blackLogo from '../../assets/black-king.png'
import Cell from '../Cell'

export default class King extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.color = color
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.KING
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false

        const dx = Math.abs(target.x - this.cell.x)
        const dy = Math.abs(target.y - this.cell.y)

        if (dx > 1 || dy > 1) return false

        // if (
        //     this.cell.isEmptyVertical(cell) ||
        //     this.cell.isEmptyHorizontal(cell) ||
        //     this.cell.isEmptyDiagonal(cell)
        // ) {
        //     return true
        // }

        return true
    }
}
