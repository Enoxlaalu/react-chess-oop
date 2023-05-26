import { Colors } from '../Colors'
import Figure, { FigureNames } from './Figure'
import whiteLogo from '../../assets/white-rook.png'
import blackLogo from '../../assets/black-rook.png'
import Cell from '../Cell'

export default class Rook extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.color = color
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.ROOK
    }

    canMove(cell: Cell): boolean {
        if (!super.canMove(cell)) return false

        if (
            this.cell.isEmptyVertical(cell) ||
            this.cell.isEmptyHorizontal(cell)
        ) {
            return true
        }

        return false
    }
}
