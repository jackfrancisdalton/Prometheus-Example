import React, { useState } from 'react';

type Props = {
  onCreate: (title: string, options: string[]) => void;
};

export const PollCreate: React.FC<Props> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!title.trim() || trimmedOptions.length < 2) return;
    onCreate(title, trimmedOptions);
    setTitle('');
    setOptions(['', '']);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-red p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Create a New Poll</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Poll title"
        className="w-full border px-3 py-2 rounded"
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[idx] = e.target.value;
            setOptions(newOpts);
          }}
          placeholder={`Option ${idx + 1}`}
          className="w-full border px-3 py-2 rounded"
        />
      ))}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setOptions((opts) => [...opts, ''])}
          className="text-blue-500 text-sm"
        >
          + Add Option
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </form>
  );
};
