import React, { Fragment, useEffect, useState } from 'react'
import CellComponent from './CellComponent'
import Board from '../models/Board'
import Cell from '../models/Cell'
import Player from '../models/Player'
import { Colors } from '../models/Colors'

interface IBoardComponent {
    board: Board
    setBoard: (board: Board) => void
    currentPlayer: Player | null
    changePlayer: () => void
    onCheckmate: (loserColor: Colors) => void
    onStalemate: () => void
    resetKey: number
}

const BoardComponent: React.FC<IBoardComponent> = ({
    board,
    setBoard,
    currentPlayer,
    changePlayer,
    onCheckmate,
    onStalemate,
    resetKey,
}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const [isCheck, setIsCheck] = useState(false)

    // Сброс isCheck и выделения при новой игре
    useEffect(() => {
        setIsCheck(false)
        setSelectedCell(null)
    }, [resetKey])

    useEffect(() => {
        showAvailableMoves()
    }, [selectedCell]) // eslint-disable-line react-hooks/exhaustive-deps

    const onCellClick = (cell: Cell) => {
        if (!currentPlayer) return

        if (selectedCell && selectedCell.figure?.canMove(cell) && cell.available) {
            selectedCell.makeMove(cell)
            setSelectedCell(null)

            const opponentColor = currentPlayer.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
            const opponentInCheck = board.isKingInCheck(opponentColor)
            setIsCheck(opponentInCheck)

            if (!board.hasLegalMoves(opponentColor)) {
                if (opponentInCheck) {
                    onCheckmate(opponentColor)
                } else {
                    onStalemate()
                }
                return
            }

            changePlayer()
        } else if (cell.figure && cell.figure.color === currentPlayer?.color) {
            setSelectedCell(cell)
        }
    }

    const showAvailableMoves = () => {
        board.showAvailableMoves(selectedCell)
        updateBoard()
    }

    const updateBoard = () => {
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    return (
        <div>
            {isCheck && <div className="check-warning">Check!</div>}
            <div className="board">
                {board.cells.map((row, index) => {
                    return (
                        <Fragment key={index}>
                            {row.map((cell) => {
                                return (
                                    <CellComponent
                                        key={cell.id}
                                        cell={cell}
                                        selected={
                                            cell.x === selectedCell?.x &&
                                            cell.y === selectedCell?.y
                                        }
                                        onCellClick={onCellClick}
                                    />
                                )
                            })}
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default BoardComponent
