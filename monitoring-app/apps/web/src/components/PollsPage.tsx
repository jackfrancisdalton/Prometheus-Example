import React from 'react';
import { usePolls } from '../hooks/usePolls';
import { PollCard } from '../components/PollCard';
import { PollCreate } from './CreatePoll';

export const PollsPage: React.FC = () => {
  const { polls, isLoading, voteMutation, createMutation } = usePolls();

  return (
    <div className="p-6 space-y-8">
      <PollCreate onCreate={(title, options) => createMutation.mutate({ title, options })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading polls...</p>
        ) : (
          polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={voteMutation.mutate} />
          ))
        )}
      </div>
    </div>
  );
};

export default PollsPage;