import React from 'react'
import Cell from '../models/Cell'

interface ICellComponent {
    cell: Cell
    selected: boolean
    onCellClick: (cell: Cell) => void
}

const CellComponent: React.FC<ICellComponent> = ({
    cell,
    selected,
    onCellClick,
}) => {
    const onClick = () => onCellClick(cell)

    return (
        <div
            className={`cell ${cell.color} ${selected ? 'selected' : ''} ${
                cell.available && cell.figure?.logo ? 'attacked' : ''
            }`}
            onClick={onClick}
        >
            {!cell.figure?.logo && cell.available && (
                <span className="available" />
            )}
            {cell.figure?.logo && <img src={cell.figure?.logo} alt="" />}
        </div>
    )
}

export default CellComponent
