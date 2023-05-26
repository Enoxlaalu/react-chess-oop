import React, { Fragment, useEffect, useState } from 'react'
import CellComponent from './CellComponent'
import Board from '../models/Board'
import Cell from '../models/Cell'
import Player from '../models/Player'

interface IBoardComponent {
    board: Board
    setBoard: (board: Board) => void
    currentPlayer: Player | null
    changePlayer: () => void
}

const BoardComponent: React.FC<IBoardComponent> = ({
    board,
    setBoard,
    currentPlayer,
    changePlayer,
}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

    useEffect(() => {
        showAvailableMoves()
    }, [selectedCell])

    const onCellClick = (cell: Cell) => {
        if (selectedCell && selectedCell.figure?.canMove(cell)) {
            selectedCell.makeMove(cell)
            setSelectedCell(null)
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
    )
}

export default BoardComponent
