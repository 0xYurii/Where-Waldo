import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// TypeScript interfaces
interface Character {
  id: number;
  name: string;
}

interface Photo {
  id: number;
  name: string;
  url: string;
  characters: Character[];
}

interface FoundCharacter {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface DropdownPosition {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
}

const API_BASE_URL = "http://localhost:3000/api";

function App() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const [foundCharacters, setFoundCharacters] = useState<FoundCharacter[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  // Load photo data on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get<Photo[]>(`${API_BASE_URL}/photos`);
        if (response.data && response.data.length > 0) {
          setPhoto(response.data[0]); // Use the first photo
        } else {
          setError("No photos available");
        }
      } catch (err) {
        setError("Failed to load game data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Check win condition
  useEffect(() => {
    if (photo && foundCharacters.length === photo.characters.length && photo.characters.length > 0) {
      setGameWon(true);
      setEndTime(Date.now());
      setDropdownPosition(null);
    }
  }, [foundCharacters, photo]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (gameWon) return;

    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const width = img.width;
    const height = img.height;

    const percentX = (pixelX / width) * 100;
    const percentY = (pixelY / height) * 100;

    setDropdownPosition({
      x: e.clientX,
      y: e.clientY,
      percentX,
      percentY,
    });
  };

  const handleCharacterSelect = async (characterId: number, characterName: string) => {
    if (!photo || !dropdownPosition) return;

    try {
      const response = await axios.post<{ found: boolean }>(`${API_BASE_URL}/validate`, {
        photoId: photo.id,
        characterId,
        x: dropdownPosition.percentX,
        y: dropdownPosition.percentY,
      });

      if (response.data.found) {
        // Character found!
        setFoundCharacters([
          ...foundCharacters,
          {
            id: characterId,
            name: characterName,
            x: dropdownPosition.percentX,
            y: dropdownPosition.percentY,
          },
        ]);
        showToast(`Found ${characterName}! 🎉`);
        setDropdownPosition(null);
      } else {
        // Wrong location
        showToast("Not quite! Try again 🔍");
      }
    } catch (err) {
      console.error("Validation error:", err);
      showToast("Error validating selection");
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const closeDropdown = () => {
    setDropdownPosition(null);
  };

  const getRemainingCharacters = (): Character[] => {
    if (!photo) return [];
    const foundIds = foundCharacters.map((fc) => fc.id);
    return photo.characters.filter((char) => !foundIds.includes(char.id));
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Error</h1>
        <p>{error || "Failed to load game"}</p>
      </div>
    );
  }

  const remainingCharacters = getRemainingCharacters();

  return (
    <div style={{ padding: "20px", textAlign: "center", minHeight: "100vh" }}>
      <h1>Where's Brian?</h1>

      {/* Character checklist */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Find these characters:</h3>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          {photo.characters.map((char) => {
            const isFound = foundCharacters.some((fc) => fc.id === char.id);
            return (
              <div
                key={char.id}
                style={{
                  padding: "8px 16px",
                  border: "2px solid",
                  borderColor: isFound ? "#4caf50" : "#666",
                  borderRadius: "8px",
                  backgroundColor: isFound ? "#4caf50" : "#333",
                  color: "white",
                  textDecoration: isFound ? "line-through" : "none",
                  opacity: isFound ? 0.6 : 1,
                }}
              >
                {char.name} {isFound && "✓"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game image with markers */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src="/game-map.jpeg"
          alt="Game Map"
          onClick={handleImageClick}
          style={{
            cursor: gameWon ? "default" : "crosshair",
            maxWidth: "100%",
            border: "2px solid white",
            userSelect: "none",
          }}
        />

        {/* Found character markers */}
        {foundCharacters.map((char) => (
          <div
            key={char.id}
            style={{
              position: "absolute",
              left: `${char.x}%`,
              top: `${char.y}%`,
              width: "40px",
              height: "40px",
              border: "3px solid #4caf50",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
            }}
          />
        ))}

        {/* Dropdown menu */}
        {dropdownPosition && remainingCharacters.length > 0 && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              onClick={closeDropdown}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 998,
              }}
            />

            {/* Dropdown */}
            <div
              style={{
                position: "fixed",
                left: `${dropdownPosition.x}px`,
                top: `${dropdownPosition.y}px`,
                backgroundColor: "white",
                border: "2px solid #333",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                zIndex: 999,
                minWidth: "150px",
              }}
            >
              {remainingCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => handleCharacterSelect(char.id, char.name)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    color: "#333",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  {char.name}
                </div>
              ))}
            </div>

            {/* Click indicator */}
            <div
              style={{
                position: "absolute",
                left: `${dropdownPosition.percentX}%`,
                top: `${dropdownPosition.percentY}%`,
                width: "30px",
                height: "30px",
                border: "2px solid red",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {toast}
        </div>
      )}

      {/* Win modal */}
      {gameWon && endTime && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h1 style={{ color: "#4caf50", marginBottom: "20px" }}>🎉 You Win! 🎉</h1>
            <p style={{ fontSize: "18px", color: "#333", marginBottom: "20px" }}>
              You found all characters in:
            </p>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "#333", marginBottom: "30px" }}>
              {formatTime(endTime - startTime)}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#45a049";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4caf50";
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
