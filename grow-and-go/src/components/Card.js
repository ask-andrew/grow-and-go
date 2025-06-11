import React from 'react';

const Card = ({ card, isFlipped, onFlip }) => {
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
      <div className={\`absolute w-full h-full transition-transform duration-700 transform-style-3d rounded-xl shadow-2xl \${isFlipped ? 'rotate-y-180' : ''}\`}>
        <div className="absolute w-full h-full backface-hidden bg-white p-6 rounded-xl border-4 border-indigo-200 flex items-center justify-center text-center">
          <h2 className="text-5xl font-extrabold text-indigo-700 select-none">{card.Concept}</h2>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-50 p-6 rounded-xl border-4 border-gray-200 flex flex-col justify-between text-left overflow-auto">
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Journal Prompt:</h3>
            <p className="text-lg text-gray-800 leading-relaxed mb-4 italic">
              {card['Journal Prompt (Gratitude/Positivity Skew)']}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Suggested Actions:</h3>
            <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
              <li>{card['Action 1 (Gratitude/Positivity Skew)']}</li>
              <li>{card['Action 2 (Gratitude/Positivity Skew)']}</li>
            </ul>
          </div>
          <div className="absolute bottom-2 right-4 text-sm italic text-gray-400">Click to flip back</div>
        </div>
      </div>
    </div>
  );
};

export default Card;