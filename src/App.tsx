import { useEffect, useState } from 'react'
import './App.css'
import BoardComponent from './components/BoardComponent'
import Board from './models/Board'
import Player from './models/Player'
import { Colors } from './models/Colors'
import LostFigures from './components/LostFigures'
import Timer from './components/Timer'

function App() {
    const [board, setBoard] = useState(new Board())
    const [whitePLayer, setWhitePLayer] = useState(new Player(Colors.WHITE))
    const [blackPLayer, setBlackPLayer] = useState(new Player(Colors.BLACK))
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)

    useEffect(() => {
        startGame()
        setCurrentPlayer(whitePLayer)
    }, [])

    function changePlayer() {
        setCurrentPlayer(
            currentPlayer?.color === Colors.WHITE ? blackPLayer : whitePLayer
        )
    }

    function startGame() {
        const board = new Board()
        board.renderBoard()
        board.addFigures()
        setBoard(board)
    }

    return (
        <div className="app">
            <Timer currentPlayer={currentPlayer} restart={startGame} />
            <BoardComponent
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                changePlayer={changePlayer}
            />
            <div>
                <LostFigures
                    color={Colors.BLACK}
                    title="Black figures"
                    figures={board.lostBlackFigures}
                />
                <LostFigures
                    color={Colors.WHITE}
                    title="White figures"
                    figures={board.lostWhiteFigures}
                />
            </div>
        </div>
    )
}

export default App
