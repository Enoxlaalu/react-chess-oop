import React from 'react'
import Figure from '../models/figures/Figure'
import { Colors } from '../models/Colors'

interface ILostFigures {
    color: Colors
    title: string
    figures: Figure[]
}

const LostFigures: React.FC<ILostFigures> = ({ color, title, figures }) => {
    return (
        <div
            className={`lostFigures ${
                color === Colors.BLACK ? 'lostBlack' : 'lostWhite'
            }`}
        >
            <h3>{title}</h3>
            <div className="figuresArray">
                {figures.map((figure) => {
                    return (
                        <div key={figure.id} className="figure">
                            {figure.name}
                            <img src={figure.logo} alt="" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default LostFigures
