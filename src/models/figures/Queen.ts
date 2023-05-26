import { Colors } from '../Colors'
import Figure, { FigureNames } from './Figure'
import whiteLogo from '../../assets/white-queen.png'
import blackLogo from '../../assets/black-queen.png'
import Cell from '../Cell'

export default class Queen extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.color = color
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.QUEEN
    }

    canMove(cell: Cell): boolean {
        if (!super.canMove(cell)) return false

        if (
            this.cell.isEmptyVertical(cell) ||
            this.cell.isEmptyHorizontal(cell) ||
            this.cell.isEmptyDiagonal(cell)
        ) {
            return true
        }

        return false
    }
}
