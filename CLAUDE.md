# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # tsc + vite build (type-check enforced)
npm run lint     # ESLint, zero-warnings policy
npm run preview  # Preview production build locally
```

No test framework is configured.

## Architecture

React + TypeScript chess game using OOP. Game logic lives entirely in `src/models/`; UI in `src/components/`.

### Object graph

`Board` owns a `Cell[][]` (8×8). Each `Cell` holds a back-reference to `Board` and optionally to a `Figure`. Each `Figure` holds a reference back to its current `Cell`. This bidirectional graph mutates in place — it is **not** a Redux-style immutable store.

### React state / re-render strategy

`App` holds a `Board` instance in React state. Since the board mutates in place, re-renders are triggered by calling `Board.getCopyBoard()`, which returns a **new Board wrapper around the same cell/figure arrays**. This shallow copy is intentional: React sees a new object reference and re-renders, while the actual cell graph is shared.

### Move execution flow

1. Click → `BoardComponent.onCellClick(cell)`
2. If a piece is already selected and `selectedCell.figure.canMove(cell)` is true → `selectedCell.makeMove(cell)` (mutates graph) → `changePlayer()`
3. Otherwise, if clicked cell has current player's piece → set as `selectedCell`
4. After selection change: `board.showAvailableMoves(selectedCell)` sets `cell.available` flags → `getCopyBoard()` + `setBoard()` triggers re-render

### Coordinate system

`Cell(board, x, y)` — `x` = column (0=a-file, 7=h-file), `y` = row (0=black back rank, 7=white back rank). `Board.getCell(x, y)` returns `cells[y][x]`.

### Figure inheritance

`Figure` base class — `canMove()` blocks capturing own pieces and the king; `makeMove()` is empty hook. Each piece subclass overrides `canMove()` using `Cell` path helpers (`isEmptyVertical`, `isEmptyHorizontal`, `isEmptyDiagonal`). `Pawn` additionally overrides `makeMove()` to clear `isFirstStep`.

### Check/checkmate detection

`Board.isKingInCheck(color)` iterates all enemy pieces to see if any can reach the king's cell. `Board.showAvailableMoves()` simulates each candidate move on a deep-copied board to filter out moves that leave the own king in check. After each move, `Board.hasLegalMoves(color)` determines checkmate vs stalemate.
