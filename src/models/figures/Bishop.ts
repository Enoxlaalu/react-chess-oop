import { Colors } from '../Colors'
import Figure, { FigureNames } from './Figure'
import whiteLogo from '../../assets/white-bishop.png'
import blackLogo from '../../assets/black-bishop.png'
import Cell from '../Cell'

export default class Bishop extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.color = color
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.BISHOP
    }

    canMove(cell: Cell): boolean {
        if (!super.canMove(cell)) return false

        if (this.cell.isEmptyDiagonal(cell)) {
            return true
        }

        return false
    }
}
