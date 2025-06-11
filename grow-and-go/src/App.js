import React, { useState, useEffect } from 'react';
import { parseCSV } from './utils/parseCSV';
import Card from './components/Card';

const csvData = `Concept,Journal Prompt (Gratitude/Positivity Skew),Action 1 (Gratitude/Positivity Skew),Action 2 (Gratitude/Positivity Skew),Imagery Idea1,Imagery Idea2
Gratitude,"What are you grateful for today?","Write a gratitude list.","Tell someone thank you.","Glowing hearts","Sunrise over a field"`;

const colorPalettes = [
  ['from-purple-400', 'to-indigo-600'],
  ['from-blue-400', 'to-cyan-600'],
  ['from-green-400', 'to-emerald-600'],
  ['from-yellow-400', 'to-orange-600'],
  ['from-pink-400', 'to-red-600'],
  ['from-teal-400', 'to-blue-600'],
  ['from-fuchsia-400', 'to-purple-600'],
];

const App = () => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentColors, setCurrentColors] = useState([]);

  useEffect(() => {
    const parsedCards = parseCSV(csvData);
    setCards(parsedCards);
    if (parsedCards.length > 0) {
      shuffleCard(parsedCards);
    }
  }, []);

  const shuffleCard = (allCards) => {
    if (allCards.length === 0) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * allCards.length);
    } while (currentCard && allCards[newIndex].Concept === currentCard.Concept);
    setCurrentCard(allCards[newIndex]);
    setIsFlipped(false);
    const randomColorIndex = Math.floor(Math.random() * colorPalettes.length);
    setCurrentColors(colorPalettes[randomColorIndex]);
  };

  const backgroundClasses = \`min-h-screen bg-gradient-to-br \${currentColors[0]} \${currentColors[1]} flex items-center justify-center p-4 font-sans transition-colors duration-1000 ease-in-out\`;

  return (
    <div className={backgroundClasses}>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-4">Grow and Go</h1>
        {currentCard ? (
          <Card card={currentCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
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
      <style>{\`
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      \`}</style>
    </div>
  );
};

export default App;