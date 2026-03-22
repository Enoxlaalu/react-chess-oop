import { Colors } from '../Colors'
import Figure, { FigureNames } from './Figure'
import whiteLogo from '../../assets/white-pawn.png'
import blackLogo from '../../assets/black-pawn.png'
import Cell from '../Cell'

export default class Pawn extends Figure {
    public isFirstStep = true

    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.color = color
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.PAWN
    }

    public canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false

        const black = this.color === Colors.BLACK
        const direction = black ? 1 : -1

        // Diagonal capture
        if (
            target.y === this.cell.y + direction &&
            (target.x === this.cell.x - 1 || target.x === this.cell.x + 1) &&
            this.cell.isEnemy(target)
        ) {
            return true
        }

        // Forward moves only along the same column
        if (this.cell.x !== target.x) return false

        // Cannot move forward onto any occupied square
        if (!target.isEmpty()) return false

        // One square forward
        if (target.y === this.cell.y + direction) return true

        // Two squares forward on first move — path must be clear
        if (
            this.isFirstStep &&
            target.y === this.cell.y + direction * 2 &&
            this.cell.isEmptyVertical(target)
        ) {
            return true
        }

        return false
    }

    public makeMove(target: Cell): void {
        super.makeMove(target)
        this.isFirstStep = false
    }
}
