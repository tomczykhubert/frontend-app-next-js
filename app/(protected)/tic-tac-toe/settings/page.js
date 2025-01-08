"use client";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase/firebase";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function TicTacToeSettings() {
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    const loadSettings = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "settings",
        "tictactoe"
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
    };
    loadSettings();
  }, [auth.currentUser, db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("symbolColors.")) {
      const color = name.split(".")[1];
      setConfig((prev) => ({
        ...prev,
        symbolColors: {
          ...prev.symbolColors,
          [color]: value,
        },
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSaving(true);
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid, "settings", "tictactoe"),
        config
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Tic Tac Toe Settings</h1>
      <Link
        href="/tic-tac-toe"
        className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
      >
        <LuArrowLeft size={25} />
        Back to game
      </Link>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 mt-5">
        <div className="flex justify-between items-center">
          <label>Game Mode: </label>
          <select
            name="gameMode"
            value={config.gameMode}
            onChange={handleChange}
            className="border p-1 rounded"
          >
            <option value="friend">Play with Friend</option>
            <option value="easy">Play with Bot (Easy)</option>
            <option value="medium">Play with Bot (Medium)</option>
            <option value="hard">Play with Bot (Hard)</option>
          </select>
        </div>

        {config.gameMode !== "friend" && (
          <div className="flex justify-between items-center">
            <label>Play as: </label>
            <select
              name="playerSymbol"
              value={config.playerSymbol}
              onChange={handleChange}
              className="border p-1 rounded"
            >
              <option value="X">X (First)</option>
              <option value="O">O (Second)</option>
            </select>
          </div>
        )}

        <div className="flex justify-between items-center">
          <label>Board Size: </label>
          <input
            type="number"
            name="boardSize"
            min="3"
            max="8"
            value={config.boardSize}
            onChange={handleChange}
            className="border p-1 rounded w-20"
          />
        </div>

        <div className="flex justify-between items-center">
          <label>Cell Size (px): </label>
          <input
            type="number"
            name="cellSize"
            min="40"
            max="120"
            value={config.cellSize}
            onChange={handleChange}
            className="border p-1 rounded w-20"
          />
        </div>

        <div className="flex justify-between items-center">
          <label>Symbol Size (rem): </label>
          <input
            type="number"
            name="symbolSize"
            min="1"
            max="5"
            step="0.5"
            value={config.symbolSize.replace("rem", "")}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "symbolSize",
                  value: `${e.target.value}rem`,
                },
              })
            }
            className="border p-1 rounded w-20"
          />
        </div>

        <div className="flex justify-between items-center">
          <label>Background Color: </label>
          <input
            type="color"
            name="backgroundColor"
            value={config.backgroundColor}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <label>Border Color: </label>
          <input
            type="color"
            name="borderColor"
            value={config.borderColor}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <label>X Color: </label>
          <input
            type="color"
            name="symbolColors.X"
            value={config.symbolColors.X}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <label>O Color: </label>
          <input
            type="color"
            name="symbolColors.O"
            value={config.symbolColors.O}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-primary px-4 py-3 text-base text-white font-medium dark:text-white hover:bg-primary/90 flex items-center gap-2"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
