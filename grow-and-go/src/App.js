import React, { useState, useEffect } from "react";

// Helper function to parse CSV data
const parseCSV = (csv) => {
  const lines = csv.split("\n").filter((line) => line.trim() !== ""); // Filter out empty lines
  const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    // A robust CSV parsing regex to handle commas within quoted fields
    const values = currentLine
      .match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
      .map((item) => item.replace(/"/g, "").trim());

    if (values.length === headers.length) {
      let entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index];
      });
      data.push(entry);
    }
  }
  return data;
};

// Define an array of color palettes for the background gradients
const colorPalettes = [
  ["from-purple-400", "to-indigo-600"],
  ["from-blue-400", "to-cyan-600"],
  ["from-green-400", "to-emerald-600"],
  ["from-yellow-400", "to-orange-600"],
  ["from-pink-400", "to-red-600"],
  ["from-teal-400", "to-blue-600"],
  ["from-fuchsia-400", "to-purple-600"],
];

// Card Component
const Card = ({
  card,
  isFlipped,
  onFlip,
  expandedPrompt,
  additionalActions,
  isExpandingPrompt,
  isGeneratingActions,
  onExpandPrompt,
  onGenerateMoreActions,
}) => {
  return (
    <div
      className="relative w-full h-80 md:h-96 cursor-pointer group mb-8"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
      onKeyDown={(e) => e.key === "Enter" && onFlip()}
      tabIndex="0"
      role="button"
      aria-pressed={isFlipped}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-700 transform-style-3d rounded-xl shadow-2xl ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-white p-6 rounded-xl border-4 border-indigo-200 flex items-center justify-center text-center">
          <h2 className="text-5xl font-extrabold text-indigo-700 select-none">{card.Concept}</h2>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-50 p-6 rounded-xl border-4 border-gray-200 flex flex-col justify-between text-left overflow-auto">
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Journal Prompt:</h3>
            <p className="text-lg text-gray-800 leading-relaxed mb-4 italic">
              {expandedPrompt || card["Journal Prompt (Gratitude/Positivity Skew)"]}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpandPrompt(card["Journal Prompt (Gratitude/Positivity Skew)"]);
              }}
              className="mt-2 px-4 py-2 bg-purple-200 text-purple-800 rounded-lg text-sm font-semibold hover:bg-purple-300 transition-colors"
              disabled={isExpandingPrompt}
            >
              {isExpandingPrompt ? "Expanding..." : "✨ Expand Prompt"}
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Suggested Actions:</h3>
            <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
              <li>{card["Action 1 (Gratitude/Positivity Skew)"]}</li>
              <li>{card["Action 2 (Gratitude/Positivity Skew)"]}</li>
              {additionalActions.map((action, index) => (
                <li key={index} className="text-green-700 italic">
                  {action}
                </li>
              ))}
            </ul>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateMoreActions(card["Journal Prompt (Gratitude/Positivity Skew)"], [
                  card["Action 1 (Gratitude/Positivity Skew)"],
                  card["Action 2 (Gratitude/Positivity Skew)"],
                ]);
              }}
              className="mt-2 px-4 py-2 bg-green-200 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-300 transition-colors"
              disabled={isGeneratingActions}
            >
              {isGeneratingActions ? "Generating..." : "✨ More Actions"}
            </button>
          </div>
          <div className="absolute bottom-2 right-4 text-sm italic text-gray-400">Click to flip back</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200 text-purple-700 text-center w-full">
        <img
          key={card.Concept}
          src={`https://placehold.co/250x180/e0cffc/7e3aed?text=${encodeURIComponent(card.Concept)}`}
          alt={`Image for ${card.Concept}`}
          className="mx-auto mt-2 rounded-md shadow-md max-w-full h-auto"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/250x180/e0cffc/7e3aed?text=Image+Loading+Error`;
          }}
        />
        <p className="text-sm opacity-80 mt-2">
          (This image is a placeholder. For real GIFs/images, integrate an API.)
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false); // State to control card flip
  const [currentColors, setCurrentColors] = useState([]); // State to store current background colors
  const [expandedPrompt, setExpandedPrompt] = useState(""); // State for expanded prompt
  const [additionalActions, setAdditionalActions] = useState([]); // State for additional actions
  const [isExpandingPrompt, setIsExpandingPrompt] = useState(false); // Loading state for expand prompt
  const [isGeneratingActions, setIsGeneratingActions] = useState(false); // Loading state for generate actions

  // Load CSV file from public folder on mount
  useEffect(() => {
    fetch("/cards.csv")
      .then((res) => {
        if (!res.ok) throw new Error("CSV file not found");
        return res.text();
      })
      .then((text) => {
        const parsedCards = parseCSV(text);
        setCards(parsedCards);
        if (parsedCards.length > 0) {
          shuffleCard(parsedCards);
        }
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  // Function to shuffle and select a new random card
  const shuffleCard = (allCards) => {
    if (allCards.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allCards.length);
    setCurrentCard(allCards[randomIndex]);
    setIsFlipped(false); // Reset flip state when shuffling a new card
    setExpandedPrompt(""); // Clear expanded prompt on new card
    setAdditionalActions([]); // Clear additional actions on new card

    // Randomly select a new color palette
    const randomColorIndex = Math.floor(Math.random() * colorPalettes.length);
    setCurrentColors(colorPalettes[randomColorIndex]);
  };

  // Function to handle card click and toggle flip state
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Mock function to expand the prompt without API call
  const handleExpandPrompt = async (originalPrompt) => {
    setIsExpandingPrompt(true);
    setTimeout(() => {
      const expanded =
        originalPrompt +
        " — Take a moment to reflect more deeply on how this applies to your daily life and growth.";
      setExpandedPrompt(expanded);
      setIsExpandingPrompt(false);
    }, 700);
  };

  // Mock function to generate more actions without API call
  const handleGenerateMoreActions = async (prompt, existingActions) => {
    setIsGeneratingActions(true);
    setTimeout(() => {
      const mockActions = [
        "Try sharing your gratitude with someone today.",
        "Write a short letter expressing positivity toward a challenge.",
      ];
      setAdditionalActions(mockActions);
      setIsGeneratingActions(false);
    }, 700);
  };

  // Combine background classes dynamically
  const backgroundClasses = `min-h-screen bg-gradient-to-br ${currentColors[0]} ${currentColors[1]} flex items-center justify-center p-4 font-sans transition-colors duration-1000 ease-in-out`;

  return (
    <div className={backgroundClasses}>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center transform transition-transform duration-500 hover:scale-105">
        {/* Replace this image src with your actual logo or other header */}
        <img
          src="uploaded:20250611_1403_Grow and Go Logo_simple_compose_01jxg5z498e0psmye6ka4hxrwb.jpg-40ddfe9d-2935-4b0e-96dc-b003b61aceae"
          alt="Grow & Go Logo"
          className="w-48 mb-8 mx-auto"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/192x70/ffffff/000000?text=Grow%20%26%20Go%20(Error)";
          }}
        />

        {currentCard ? (
          <Card
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            expandedPrompt={expandedPrompt}
            additionalActions={additionalActions}
            isExpandingPrompt={isExpandingPrompt}
            isGeneratingActions={isGeneratingActions}
            onExpandPrompt={handleExpandPrompt}
            onGenerateMoreActions={handleGenerateMoreActions}
          />
        ) : (
          <p className="text-lg text-gray-600">Loading journal prompts...</p>
        )}

        <button
          onClick={() => shuffleCard(cards)}
          className="mt-10 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 active:bg-green-700"
        >
          Let's play with another idea
        </button>
      </div>

      {/* Custom CSS for flip effect */}
      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default App;
