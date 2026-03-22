import React, { useEffect, useRef, useState } from 'react'
import Player from '../models/Player'
import { Colors } from '../models/Colors'

interface ITimer {
    currentPlayer: Player | null
    restart: () => void
    onTimeout: (loser: Colors) => void
    resetKey: number
}

const Timer: React.FC<ITimer> = ({ currentPlayer, restart, onTimeout, resetKey }) => {
    const [blackTime, setBlackTime] = useState(300)
    const [whiteTime, setWhiteTime] = useState(300)
    const timer = useRef<ReturnType<typeof setInterval> | null>(null)
    const onTimeoutRef = useRef(onTimeout)

    useEffect(() => {
        onTimeoutRef.current = onTimeout
    }, [onTimeout])

    // Сброс таймера при новой игре
    useEffect(() => {
        if (timer.current) clearInterval(timer.current)
        setBlackTime(300)
        setWhiteTime(300)
    }, [resetKey])

    // Запуск/переключение интервала при смене игрока или сбросе
    useEffect(() => {
        if (!currentPlayer) return
        if (timer.current) clearInterval(timer.current)
        const color = currentPlayer.color
        timer.current = setInterval(() => {
            if (color === Colors.BLACK) {
                setBlackTime((prev) => Math.max(0, prev - 1))
            } else {
                setWhiteTime((prev) => Math.max(0, prev - 1))
            }
        }, 1000)
        return () => {
            if (timer.current) clearInterval(timer.current)
        }
    }, [currentPlayer, resetKey])

    // Вызов onTimeout вне updater — реагируем на изменение времени
    useEffect(() => {
        if (blackTime === 0) onTimeoutRef.current(Colors.BLACK)
    }, [blackTime])

    useEffect(() => {
        if (whiteTime === 0) onTimeoutRef.current(Colors.WHITE)
    }, [whiteTime])

    const resetTimers = () => {
        restart()
    }

    return (
        <div>
            <button onClick={resetTimers}>Restart game</button>
            <h2>Black player - {blackTime}</h2>
            <h2>White player - {whiteTime}</h2>
        </div>
    )
}

export default Timer
