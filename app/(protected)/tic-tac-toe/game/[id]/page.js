"use client";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app, db, auth } from "@/app/lib/firebase/firebase";
import TicTacToe from "../../page";
import { useParams } from "next/navigation";

export default function SavedGame() {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const params = useParams();

  useEffect(() => {
    const loadGame = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "tictactoe-games",
        params.id
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGameData(docSnap.data());
      }
      setLoading(false);
    };
    loadGame();
  }, [auth.currentUser, db, params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Game not found
      </div>
    );
  }

  return <TicTacToe gameId={params.id} initialState={gameData} />;
}
