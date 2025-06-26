import React from 'react';
import type { Poll } from '../types/Poll';

type Props = {
  poll: Poll;
  onVote: (input: { pollId: number; optionId: number }) => void;
};

export const PollCard: React.FC<Props> = ({ poll, onVote }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">{poll.title}</h2>
      <div className="space-y-2">
        {poll.options.map((opt) => (
          <button
            key={opt.id}
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-left transition"
            onClick={() => onVote({ pollId: poll.id, optionId: opt.id })}
          >
            {opt.text} — <span className="text-sm">{opt.votes} vote(s)</span>
          </button>
        ))}
      </div>
    </div>
  );
};
