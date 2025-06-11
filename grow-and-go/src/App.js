import React, { useState, useEffect } from 'react';

// Your parseCSV helper (unchanged)
const parseCSV = (csv) => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const values = currentLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(item => item.replace(/"/g, '').trim());

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

const colorPalettes = [
  ['from-purple-400', 'to-indigo-600'],
  ['from-blue-400', 'to-cyan-600'],
  ['from-green-400', 'to-emerald-600'],
  ['from-yellow-400', 'to-orange-600'],
  ['from-pink-400', 'to-red-600'],
  ['from-teal-400', 'to-blue-600'],
  ['from-fuchsia-400', 'to-purple-600'],
];

// Your Card component stays the same (copy-paste here)...

const Card = ({ card, isFlipped, onFlip, expandedPrompt, additionalActions, isExpandingPrompt, isGeneratingActions, onExpandPrompt, onGenerateMoreActions }) => {
  return (
    <div
      className="relative w-full h-80 md:h-96 cursor-pointer group mb-8"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
      onKeyDown={(e) => e.key === 'Enter' && onFlip()}
      tabIndex="0"
      role="button"
      aria-pressed={isFlipped}
    >
      <div className={`absolute w-full h-full transition-transform duration-700 transform-style-3d rounded-xl shadow-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden bg-white p-6 rounded-xl border-4 border-indigo-200 flex items-center justify-center text-center">
          <h2 className="text-5xl font-extrabold text-indigo-700 select-none">{card.Concept}</h2>
        </div>

        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-50 p-6 rounded-xl border-4 border-gray-200 flex flex-col justify-between text-left overflow-auto">
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Journal Prompt:</h3>
            <p className="text-lg text-gray-800 leading-relaxed mb-4 italic">
              {expandedPrompt || card['Journal Prompt (Gratitude/Positivity Skew)']}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onExpandPrompt(card['Journal Prompt (Gratitude/Positivity Skew)']); }}
              className="mt-2 px-4 py-2 bg-purple-200 text-purple-800 rounded-lg text-sm font-semibold hover:bg-purple-300 transition-colors"
              disabled={isExpandingPrompt}
            >
              {isExpandingPrompt ? 'Expanding...' : '✨ Expand Prompt'}
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Suggested Actions:</h3>
            <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
              <li>{card['Action 1 (Gratitude/Positivity Skew)']}</li>
              <li>{card['Action 2 (Gratitude/Positivity Skew)']}</li>
              {additionalActions.map((action, index) => (
                <li key={index} className="text-green-700 italic">{action}</li>
              ))}
            </ul>
            <button
              onClick={(e) => { e.stopPropagation(); onGenerateMoreActions(card['Journal Prompt (Gratitude/Positivity Skew)'], [card['Action 1 (Gratitude/Positivity Skew)'], card['Action 2 (Gratitude/Positivity Skew)']]); }}
              className="mt-2 px-4 py-2 bg-green-200 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-300 transition-colors"
              disabled={isGeneratingActions}
            >
              {isGeneratingActions ? 'Generating...' : '✨ More Actions'}
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentColors, setCurrentColors] = useState([]);
  const [expandedPrompt, setExpandedPrompt] = useState('');
  const [additionalActions, setAdditionalActions] = useState([]);
  const [isExpandingPrompt, setIsExpandingPrompt] = useState(false);
  const [isGeneratingActions, setIsGeneratingActions] = useState(false);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/cards.csv')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch CSV file");
        return res.text();
      })
      .then(csvText => {
        const parsedCards = parseCSV(csvText);
        setCards(parsedCards);
        if (parsedCards.length > 0) {
          shuffleCard(parsedCards);
        }
      })
      .catch(err => {
        console.error("Error loading CSV:", err);
      });
  }, []);

  const shuffleCard = (allCards) => {
    if (allCards.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allCards.length);
    setCurrentCard(allCards[randomIndex]);
    setIsFlipped(false);
    setExpandedPrompt('');
    setAdditionalActions([]);

    const randomColorIndex = Math.floor(Math.random() * colorPalettes.length);
    setCurrentColors(colorPalettes[randomColorIndex]);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  // Your existing handlers for expand prompt and generate more actions go here (unchanged)
  // ... (copy the functions handleExpandPrompt and handleGenerateMoreActions from your original code)

  // For brevity, just paste those as they are from your original code here.

  // Combine background classes dynamically
  const backgroundClasses = `min-h-screen bg-gradient-to-br ${currentColors[0]} ${currentColors[1]} flex items-center justify-center p-4 font-sans transition-colors duration-1000 ease-in-out`;

  return (
    <div className={backgroundClasses}>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center transform transition-transform duration-500 hover:scale-105">
        {/* Replace this with your actual logo image or header */}
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
            onExpandPrompt={(prompt) => {
              // paste your handleExpandPrompt logic here or call the function
            }}
            onGenerateMoreActions={(prompt, existingActions) => {
              // paste your handleGenerateMoreActions logic here or call the function
            }}
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
