import { Colors } from '../Colors'
import Figure, { FigureNames } from './Figure'
import whiteLogo from '../../assets/white-pawn.png'
import blackLogo from '../../assets/black-pawn.png'
import Cell from '../Cell'

export default class Pawn extends Figure {
    private isFirstStep = true

    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.color = color
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.PAWN
    }

    public canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.cell.x === target.x && this.cell.isEnemy(target)) return false

        const step = this.isFirstStep ? 2 : 1

        const black = this.cell.figure?.color === Colors.BLACK
        const direction = black ? 1 : -1

        if (
            target.y === this.cell.y + direction &&
            (target.x === this.cell.x - 1 || target.x === this.cell.x + 1) &&
            this.cell.isEnemy(target)
        ) {
            return true
        }

        if (this.cell.x !== target.x) return false

        if (black) {
            if (target.y - this.cell.y > step || target.y - this.cell.y < 0)
                return false
        } else {
            if (this.cell.y - target.y > step || this.cell.y - target.y < 0)
                return false
        }

        return true
    }

    public makeMove(target: Cell): void {
        super.makeMove(target)

        this.isFirstStep = false
    }
}
