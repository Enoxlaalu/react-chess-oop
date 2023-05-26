import React, { useEffect, useRef, useState } from 'react'
import Player from '../models/Player'
import { Colors } from '../models/Colors'

interface ITimer {
    currentPlayer: Player | null
    restart: () => void
}

const Timer: React.FC<ITimer> = ({ currentPlayer, restart }) => {
    const [blackTime, setBlackTime] = useState(300)
    const [whiteTime, setWhiteTime] = useState(300)
    const timer = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        startTimer()
    }, [currentPlayer])

    const subtractSecond = (color: Colors | undefined) =>
        color === Colors.BLACK
            ? setBlackTime((prev) => prev - 1)
            : setWhiteTime((prev) => prev - 1)

    const startTimer = () => {
        if (timer.current) clearInterval(timer.current)

        timer.current = setInterval(
            () => subtractSecond(currentPlayer?.color),
            1000
        )
    }

    const resetTiimers = () => {
        setBlackTime(300)
        setWhiteTime(300)
        restart()
    }

    return (
        <div>
            <button onClick={resetTiimers}>Restart game</button>
            <h2>Black player - {blackTime}</h2>
            <h2>White player - {whiteTime}</h2>
        </div>
    )
}

export default Timer
