import React, { useState, useEffect } from "react";

const levelSettings = {
  1: { min: 10, max: 50, name: "Beginner" },
  2: { min: 50, max: 100, name: "Intermediate" },
  3: { min: 100, max: 200, name: "Advanced" },
};

const generateImages = (count) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      id: i,
      url: `https://picsum.photos/80/80?random=${Math.random()}`,
      top: Math.floor(Math.random() * 85) + "%",
      left: Math.floor(Math.random() * 85) + "%",
    });
  }
  return images;
};

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startGame = () => {
    setIsRunning(true);
    setTime(0);
    setShowResults(false);
    setUserInput("");
    setGameStarted(true);

    const count = randomBetween(
      levelSettings[level].min,
      levelSettings[level].max
    );
    const generatedImages = generateImages(count);
    setImages(generatedImages);
    setImageCount(count);
  };

  const submitResult = () => {
    if (!userInput) return;

    setIsRunning(false);
    const correct = parseInt(userInput) === imageCount;
    setIsCorrect(correct);
    setShowResults(true);
  };

  const retry = () => {
    setShowResults(false);
    setUserInput("");
    setImages([]);
    setGameStarted(false);
    setTime(0);
  };

  const nextLevel = () => {
    setLevel((prev) => Math.min(prev + 1, 3));
    setShowResults(false);
    setUserInput("");
    setImages([]);
    setGameStarted(false);
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-2">
            🧘 Focus & Relax
          </h1>
          <p className="text-teal-700">
            Count the images to improve your visual focus
          </p>
        </div>

        {!gameStarted && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4">
              Select Difficulty
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`p-4 rounded-xl transition-all ${
                    level === lvl
                      ? "bg-teal-600 text-white shadow-lg scale-105"
                      : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                  }`}
                >
                  <div className="font-bold text-lg">
                    {levelSettings[lvl].name}
                  </div>
                  <div className="text-sm mt-1">
                    {levelSettings[lvl].min}-{levelSettings[lvl].max} images
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Challenge
            </button>
          </div>
        )}

        {gameStarted && !showResults && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-teal-700">
                  ⏱️ {formatTime(time)}
                </div>
                <div className="text-lg text-teal-600">
                  Level: {levelSettings[level].name}
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="How many images?"
                  className="flex-1 px-4 py-3 border-2 border-teal-300 rounded-xl focus:outline-none focus:border-teal-500 text-lg"
                  onKeyPress={(e) => e.key === "Enter" && submitResult()}
                />
                <button
                  onClick={submitResult}
                  disabled={!userInput}
                  className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Done
                </button>
              </div>
            </div>

            <div
              className="relative bg-white rounded-2xl shadow-lg p-4 mx-auto"
              style={{ height: "600px", maxWidth: "1200px" }}
            >
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="absolute rounded-lg shadow-md transition-opacity duration-300 hover:opacity-80"
                  style={{
                    top: img.top,
                    left: img.left,
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              ))}
            </div>
          </>
        )}

        {showResults && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div
              className={`text-6xl mb-4 ${
                isCorrect ? "text-green-500" : "text-orange-500"
              }`}
            >
              {isCorrect ? "🎉" : "💭"}
            </div>

            <h2
              className={`text-3xl font-bold mb-2 ${
                isCorrect ? "text-green-700" : "text-orange-700"
              }`}
            >
              {isCorrect ? "Perfect!" : "Not quite!"}
            </h2>

            <div className="text-xl text-gray-700 mb-6">
              <p>
                Your answer: <span className="font-bold">{userInput}</span>
              </p>
              <p>
                Correct answer: <span className="font-bold">{imageCount}</span>
              </p>
              <p className="mt-3">
                Time taken:{" "}
                <span className="font-bold text-teal-600">
                  {formatTime(time)}
                </span>
              </p>
            </div>

            {!isCorrect && (
              <p className="text-gray-600 mb-6 italic">
                {Math.abs(parseInt(userInput) - imageCount) <= 5
                  ? "So close! Take a moment to breathe and try again."
                  : "Take your time and focus. You've got this!"}
              </p>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={retry}
                className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
              >
                Try Again
              </button>

              {isCorrect && level < 3 && (
                <button
                  onClick={nextLevel}
                  className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all"
                >
                  Next Level →
                </button>
              )}

              {isCorrect && level === 3 && (
                <button
                  onClick={retry}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
