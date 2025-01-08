"use client";
import { useState, useEffect, useRef } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase/firebase";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { LuHistory } from "react-icons/lu";

export default function TicTacToe({ gameId, initialState }) {
  const gameIdRef = useRef(gameId || crypto.randomUUID());

  const [config, setConfig] = useState({
    boardSize: 3,
    backgroundColor: "#ffffff",
    symbolColors: { X: "#ff0000", O: "#0000ff" },
    borderColor: "#000000",
    cellSize: 80,
    symbolSize: "2rem",
    gameMode: "friend",
    playerSymbol: "X",
  });

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStats, setGameStats] = useState({
    xMoves: 0,
    oMoves: 0,
    emptyFields: 9,
  });

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;

      const settingsRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "settings",
        "tictactoe"
      );
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const settings = settingsSnap.data();
        setConfig(settings);

        if (!initialState && !gameId) {
          setBoard(Array(settings.boardSize * settings.boardSize).fill(null));
          setGameStats((prev) => ({
            ...prev,
            emptyFields: settings.boardSize * settings.boardSize,
          }));

          if (settings.gameMode !== "friend" && settings.playerSymbol === "O") {
            const newBoard = Array(
              settings.boardSize * settings.boardSize
            ).fill(null);
            const botMove = getBotMove(newBoard, settings.gameMode);
            if (botMove !== null) {
              newBoard[botMove] = "X";
              setBoard(newBoard);
              setGameStats((prev) => ({
                ...prev,
                xMoves: 1,
                emptyFields: prev.emptyFields - 1,
              }));
            }
          }
        }
      }

      if (initialState) {
        setBoard(initialState.currentBoard);
        setXIsNext(initialState.xIsNext);
        setGameStats({
          xMoves: initialState.xMoves,
          oMoves: initialState.oMoves,
          emptyFields: initialState.emptyFields,
        });
        setConfig((prev) => ({
          ...prev,
          boardSize: initialState.boardSize,
          gameMode: initialState.gameMode || "friend",
          playerSymbol: initialState.playerSymbol || "X",
        }));
      }
    };
    loadData();
  }, [auth.currentUser, db, initialState, gameId]);

  const getEmptySquares = (currentBoard) => {
    return currentBoard.reduce((squares, square, index) => {
      if (!square) squares.push(index);
      return squares;
    }, []);
  };

  const findWinningMove = (board, symbol) => {
    const emptySquares = getEmptySquares(board);

    for (const move of emptySquares) {
      const testBoard = [...board];
      testBoard[move] = symbol;
      if (calculateWinner(testBoard) === symbol) {
        return move;
      }
    }
    return null;
  };

  const getBotMove = (currentBoard, difficulty) => {
    const emptySquares = getEmptySquares(currentBoard);
    if (emptySquares.length === 0) return null;

    const botSymbol = config.playerSymbol === "X" ? "O" : "X";

    // Try to win
    const winningMove = findWinningMove(currentBoard, botSymbol);
    if (winningMove !== null) {
      return winningMove;
    }

    // Try to block player's winning move
    const blockingMove = findWinningMove(currentBoard, config.playerSymbol);
    if (blockingMove !== null) {
      return blockingMove;
    }

    // Make a random move based on difficulty
    switch (difficulty) {
      case "easy":
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];

      case "medium": {
        // 70% random, 30% strategic moves (center or corners)
        if (Math.random() < 0.7) {
          return emptySquares[Math.floor(Math.random() * emptySquares.length)];
        }
        // Try to take center or corners if available
        const boardCenter = Math.floor(currentBoard.length / 2);
        const boardSize = Math.sqrt(currentBoard.length);
        const cornerPositions = [
          0, // top left
          boardSize - 1, // top right
          boardSize * (boardSize - 1), // bottom left
          boardSize * boardSize - 1, // bottom right
        ];
        const strategicMoves = [boardCenter, ...cornerPositions];
        const availableStrategicMoves = strategicMoves.filter((move) =>
          emptySquares.includes(move)
        );
        return availableStrategicMoves.length > 0
          ? availableStrategicMoves[
              Math.floor(Math.random() * availableStrategicMoves.length)
            ]
          : emptySquares[Math.floor(Math.random() * emptySquares.length)];
      }

      case "hard": {
        const boardCenter = Math.floor(currentBoard.length / 2);
        const boardSize = Math.sqrt(currentBoard.length);
        const cornerPositions = [
          0, // top left
          boardSize - 1, // top right
          boardSize * (boardSize - 1), // bottom left
          boardSize * boardSize - 1, // bottom right
        ];

        if (emptySquares.includes(boardCenter)) return boardCenter;

        const availableCorners = cornerPositions.filter((corner) =>
          emptySquares.includes(corner)
        );
        if (availableCorners.length > 0) {
          return availableCorners[
            Math.floor(Math.random() * availableCorners.length)
          ];
        }
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
      }

      default:
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }
  };

  const calculateWinner = (squares) => {
    for (let i = 0; i < config.boardSize; i++) {
      for (let j = 0; j <= config.boardSize - config.boardSize; j++) {
        const row = squares.slice(
          i * config.boardSize,
          (i + 1) * config.boardSize
        );
        if (
          row.every((cell) => cell === "X") ||
          row.every((cell) => cell === "O")
        ) {
          return row[0];
        }
      }
    }

    for (let i = 0; i < config.boardSize; i++) {
      const column = [];
      for (let j = 0; j < config.boardSize; j++) {
        column.push(squares[i + j * config.boardSize]);
      }
      if (
        column.every((cell) => cell === "X") ||
        column.every((cell) => cell === "O")
      ) {
        return column[0];
      }
    }

    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < config.boardSize; i++) {
      diagonal1.push(squares[i * config.boardSize + i]);
      diagonal2.push(
        squares[i * config.boardSize + (config.boardSize - 1 - i)]
      );
    }
    if (
      diagonal1.every((cell) => cell === "X") ||
      diagonal1.every((cell) => cell === "O")
    ) {
      return diagonal1[0];
    }
    if (
      diagonal2.every((cell) => cell === "X") ||
      diagonal2.every((cell) => cell === "O")
    ) {
      return diagonal2[0];
    }

    return null;
  };

  const handleClick = async (i) => {
    if (calculateWinner(board) || board[i]) {
      return;
    }

    const newBoard = [...board];
    const playerSymbol = config.playerSymbol || "X";
    const botSymbol = playerSymbol === "X" ? "O" : "X";

    newBoard[i] = playerSymbol;

    const newStats = {
      xMoves: gameStats.xMoves + (playerSymbol === "X" ? 1 : 0),
      oMoves: gameStats.oMoves + (playerSymbol === "O" ? 1 : 0),
      emptyFields: gameStats.emptyFields - 1,
    };

    setBoard(newBoard);
    setGameStats(newStats);

    if (
      config.gameMode !== "friend" &&
      !calculateWinner(newBoard) &&
      newStats.emptyFields > 0
    ) {
      const botMove = getBotMove(newBoard, config.gameMode);
      if (botMove !== null) {
        newBoard[botMove] = botSymbol;
        newStats[botSymbol === "X" ? "xMoves" : "oMoves"] += 1;
        newStats.emptyFields -= 1;

        setBoard(newBoard);
        setGameStats(newStats);
      }
    } else {
      setXIsNext(!xIsNext);
    }

    const winner = calculateWinner(newBoard);
    const gameData = {
      timestamp: serverTimestamp(),
      lastModified: serverTimestamp(),
      status:
        winner || newStats.emptyFields === 0 ? "completed" : "in_progress",
      winner: winner || (newStats.emptyFields === 0 ? "Draw" : null),
      xMoves: newStats.xMoves,
      oMoves: newStats.oMoves,
      boardSize: config.boardSize,
      currentBoard: newBoard,
      xIsNext: config.gameMode === "friend" ? !xIsNext : true,
      emptyFields: newStats.emptyFields,
      gameMode: config.gameMode,
      playerSymbol: config.playerSymbol,
    };

    try {
      await setDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid,
          "tictactoe-games",
          gameIdRef.current
        ),
        gameData
      );
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : gameStats.emptyFields === 0
    ? "Game is a draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const resetGame = () => {
    setBoard(Array(config.boardSize * config.boardSize).fill(null));
    setXIsNext(true);
    setGameStats({
      xMoves: 0,
      oMoves: 0,
      emptyFields: config.boardSize * config.boardSize,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">
        Tic Tac Toe {config.boardSize}x{config.boardSize}
        {config.gameMode !== "friend" && ` (vs Bot - ${config.gameMode})`}
      </h1>

      {config.gameMode !== "friend" && (
        <p className="mb-4 text-lg">
          You are playing as:{" "}
          {gameData?.playerSymbol || config.playerSymbol || "X"}
        </p>
      )}

      <div className="mb-4 flex items-center justify-center gap-3">
        <Link
          href="/tic-tac-toe/settings"
          className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
        >
          <LuSettings size={25} />
          Settings
        </Link>
        <Link
          href="/tic-tac-toe/history"
          className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
        >
          <LuHistory size={25} />
          History
        </Link>
      </div>

      <div className="mb-4">
        <p>X Moves: {gameStats.xMoves}</p>
        <p>O Moves: {gameStats.oMoves}</p>
        <p>Empty Fields: {gameStats.emptyFields}</p>
        <p className="font-bold">{status}</p>
      </div>

      <div
        className="grid gap-1 mb-4"
        style={{
          gridTemplateColumns: `repeat(${config.boardSize}, ${config.cellSize}px)`,
        }}
      >
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: `${config.cellSize}px`,
              height: `${config.cellSize}px`,
              backgroundColor: config.backgroundColor,
              borderColor: config.borderColor,
              color: square ? config.symbolColors[square] : "inherit",
              fontSize: config.symbolSize,
            }}
            className="border-2 flex items-center justify-center font-bold hover:bg-gray-100"
            disabled={Boolean(winner || square)}
          >
            {square}
          </button>
        ))}
      </div>

      <div className="space-x-4">
        <button
          className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
