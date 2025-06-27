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
        {poll.options.map((opt) => {
          const isUserVote = poll.currentUserVoteOptionId === opt.id;

          return (
            <button
              key={opt.id}
              className={`w-full px-0 py-0 rounded overflow-hidden relative text-left group border
                ${isUserVote ? 'border-blue-500' : 'border-gray-200'}`}
              onClick={() => onVote({ pollId: poll.id, optionId: opt.id })}
              disabled={!!poll.currentUserVoteOptionId}
            >
              {/* background fill bar */}
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                  isUserVote ? 'bg-blue-100' : 'bg-gray-200'
                }`}
                style={{ width: `${opt.percentage}%` }}
              ></div>

              {/* content over the background */}
              <div className="relative z-10 px-4 py-2 flex justify-between items-center">
                <span className="font-medium">{opt.text}</span>
                <span className="text-sm text-gray-700">{opt.percentage}%{isUserVote ? ' (You)' : ''}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};