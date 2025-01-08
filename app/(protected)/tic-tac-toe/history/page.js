"use client";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase/firebase";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function TicTacToeHistory() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!auth.currentUser) return;

      const gamesRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "tictactoe-games"
      );
      const q = query(gamesRef, orderBy("lastModified", "desc"));
      const querySnapshot = await getDocs(q);

      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp:
          doc.data().timestamp?.toDate()?.toLocaleString() || "Unknown",
      }));

      setGames(gamesData);
    };
    loadHistory();
  }, [auth.currentUser, db]);

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-8">Game History</h1>

      <Link
        href="/tic-tac-toe"
        className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
      >
        <LuArrowLeft size={25} />
        Back to game
      </Link>

      <div className="w-full max-w-2xl space-y-4 mt-5">
        {games.map((game) => (
          <div key={game.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p>Date: {game.timestamp}</p>
                <p>Status: {game.status}</p>
                {game.winner && <p>Winner: {game.winner}</p>}
                <p>
                  X Moves: {game.xMoves} | O Moves: {game.oMoves}
                </p>
              </div>
              <Link
                href={`/tic-tac-toe/game/${game.id}`}
                className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
              >
                {game.status === "completed" ? "View Game" : "Resume Game"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
