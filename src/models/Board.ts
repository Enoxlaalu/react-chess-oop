import Cell from './Cell'
import { Colors } from './Colors'
import Bishop from './figures/Bishop'
import Figure, { FigureNames } from './figures/Figure'
import King from './figures/King'
import Knight from './figures/Knight'
import Pawn from './figures/Pawn'
import Queen from './figures/Queen'
import Rook from './figures/Rook'

export default class Board {
    cells: Cell[][] = []
    lostBlackFigures: Figure[] = []
    lostWhiteFigures: Figure[] = []

    public renderBoard() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = []

            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null))
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null))
                }
            }

            this.cells.push(row)
        }
    }

    public getCell(x: number, y: number): Cell {
        return this.cells[y][x]
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i, 1))
            new Pawn(Colors.WHITE, this.getCell(i, 6))
        }
    }

    private addKings() {
        new King(Colors.BLACK, this.getCell(4, 0))
        new King(Colors.WHITE, this.getCell(4, 7))
    }

    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(3, 0))
        new Queen(Colors.WHITE, this.getCell(3, 7))
    }

    private addRooks() {
        new Rook(Colors.BLACK, this.getCell(0, 0))
        new Rook(Colors.BLACK, this.getCell(7, 0))
        new Rook(Colors.WHITE, this.getCell(0, 7))
        new Rook(Colors.WHITE, this.getCell(7, 7))
    }

    private addKnights() {
        new Knight(Colors.BLACK, this.getCell(1, 0))
        new Knight(Colors.BLACK, this.getCell(6, 0))
        new Knight(Colors.WHITE, this.getCell(1, 7))
        new Knight(Colors.WHITE, this.getCell(6, 7))
    }

    private addBishops() {
        new Bishop(Colors.BLACK, this.getCell(2, 0))
        new Bishop(Colors.BLACK, this.getCell(5, 0))
        new Bishop(Colors.WHITE, this.getCell(2, 7))
        new Bishop(Colors.WHITE, this.getCell(5, 7))
    }

    public addFigures() {
        this.addPawns()
        this.addKings()
        this.addQueens()
        this.addRooks()
        this.addKnights()
        this.addBishops()
    }

    public getCopyBoard(): Board {
        const newBoard = new Board()

        newBoard.cells = this.cells
        newBoard.lostBlackFigures = this.lostBlackFigures
        newBoard.lostWhiteFigures = this.lostWhiteFigures

        return newBoard
    }

    /**
     * Creates a deep copy of the board for move simulation.
     * Figures are re-created as plain objects with just the fields needed for canMove checks.
     */
    public deepCopy(): Board {
        const copy = new Board()

        // Build empty cells
        for (let y = 0; y < 8; y++) {
            const row: Cell[] = []
            for (let x = 0; x < 8; x++) {
                const orig = this.cells[y][x]
                row.push(new Cell(copy, x, y, orig.color, null))
            }
            copy.cells.push(row)
        }

        // Copy figures
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const origFig = this.cells[y][x].figure
                if (origFig) {
                    const destCell = copy.getCell(x, y)
                    let fig: Figure
                    switch (origFig.name) {
                        case FigureNames.PAWN: {
                            const pawn = new Pawn(origFig.color, destCell)
                            pawn.isFirstStep = (origFig as Pawn).isFirstStep
                            fig = pawn
                            break
                        }
                        case FigureNames.ROOK:   fig = new Rook(origFig.color, destCell); break
                        case FigureNames.KNIGHT: fig = new Knight(origFig.color, destCell); break
                        case FigureNames.BISHOP: fig = new Bishop(origFig.color, destCell); break
                        case FigureNames.QUEEN:  fig = new Queen(origFig.color, destCell); break
                        case FigureNames.KING:   fig = new King(origFig.color, destCell); break
                        default:                 fig = new Figure(origFig.color, destCell); break
                    }
                    destCell.figure = fig
                    fig.cell = destCell
                }
            }
        }

        copy.lostBlackFigures = [...this.lostBlackFigures]
        copy.lostWhiteFigures = [...this.lostWhiteFigures]

        return copy
    }

    public getKingCell(color: Colors): Cell | null {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const fig = this.cells[y][x].figure
                if (fig && fig.name === FigureNames.KING && fig.color === color) {
                    return this.cells[y][x]
                }
            }
        }
        return null
    }

    public isKingInCheck(color: Colors): boolean {
        const kingCell = this.getKingCell(color)
        if (!kingCell) return false

        const enemyColor = color === Colors.WHITE ? Colors.BLACK : Colors.WHITE

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const fig = this.cells[y][x].figure
                if (fig && fig.color === enemyColor) {
                    if (fig.canMove(kingCell)) return true
                }
            }
        }
        return false
    }

    /**
     * Simulates a move on a deep copy and checks if the moving side's king is in check.
     */
    private moveLeavesKingInCheck(fromX: number, fromY: number, toX: number, toY: number, color: Colors): boolean {
        const copy = this.deepCopy()
        const fromCell = copy.getCell(fromX, fromY)
        const toCell = copy.getCell(toX, toY)

        if (fromCell.figure) {
            toCell.figure = fromCell.figure
            toCell.figure.cell = toCell
            fromCell.figure = null
        }

        return copy.isKingInCheck(color)
    }

    public hasLegalMoves(color: Colors): boolean {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const fig = this.cells[y][x].figure
                if (!fig || fig.color !== color) continue

                for (let ty = 0; ty < 8; ty++) {
                    for (let tx = 0; tx < 8; tx++) {
                        const target = this.cells[ty][tx]
                        if (fig.canMove(target)) {
                            if (!this.moveLeavesKingInCheck(x, y, tx, ty, color)) {
                                return true
                            }
                        }
                    }
                }
            }
        }
        return false
    }

    public showAvailableMoves = (selected: Cell | null) => {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i]

            for (let j = 0; j < row.length; j++) {
                const currentCell = row[j]
                const fig = selected?.figure

                if (fig && fig.canMove(currentCell)) {
                    // Filter: move must not leave own king in check
                    const safe = !this.moveLeavesKingInCheck(
                        fig.cell.x, fig.cell.y,
                        currentCell.x, currentCell.y,
                        fig.color
                    )
                    currentCell.available = safe
                } else {
                    currentCell.available = false
                }
            }
        }
    }
}
