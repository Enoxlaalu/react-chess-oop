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
    const [whitePlayer] = useState(new Player(Colors.WHITE))
    const [blackPlayer] = useState(new Player(Colors.BLACK))
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
    const [winner, setWinner] = useState<string | null>(null)
    const [resetKey, setResetKey] = useState(0)

    useEffect(() => {
        startGame()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function changePlayer() {
        setCurrentPlayer((prev) =>
            prev?.color === Colors.WHITE ? blackPlayer : whitePlayer
        )
    }

    function startGame() {
        const newBoard = new Board()
        newBoard.renderBoard()
        newBoard.addFigures()
        setBoard(newBoard)
        setWinner(null)
        setCurrentPlayer(whitePlayer)
        setResetKey((k) => k + 1)
    }

    function handleTimeout(loser: Colors) {
        setWinner(loser === Colors.WHITE ? 'Black wins on time!' : 'White wins on time!')
    }

    function handleCheckmate(loserColor: Colors) {
        setWinner(loserColor === Colors.WHITE ? 'Black wins by checkmate!' : 'White wins by checkmate!')
    }

    function handleStalemate() {
        setWinner('Draw by stalemate!')
    }

    return (
        <div className="app">
            {winner && (
                <div className="winner-banner">
                    <h1>{winner}</h1>
                    <button onClick={startGame}>New Game</button>
                </div>
            )}
            <Timer
                currentPlayer={winner ? null : currentPlayer}
                restart={startGame}
                onTimeout={handleTimeout}
                resetKey={resetKey}
            />
            <BoardComponent
                board={board}
                setBoard={setBoard}
                currentPlayer={winner ? null : currentPlayer}
                changePlayer={changePlayer}
                onCheckmate={handleCheckmate}
                onStalemate={handleStalemate}
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
