// src/hooks/usePolls.ts
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
import type { Poll } from '../types/Poll';

const API_URL = 'http://localhost:3000';

const getVoterId = () => {
    let storedId = localStorage.getItem('voterId');
    if (!storedId) {
        storedId = uuidv4();
        localStorage.setItem('voterId', storedId);
    }
    return storedId;
};

export const usePolls = () => {
    const queryClient = useQueryClient();
    const [polls, setPolls] = useState<Poll[]>([]);
    const voterId = getVoterId();

    const { isLoading } = useQuery({
        queryKey: ['polls'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/polls?voterId=${voterId}`);
            const data = await res.json();
            setPolls(data);
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async ({ title, options }: { title: string; options: string[] }) => {
            const res = await fetch(`${API_URL}/polls`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, options }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create poll');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['polls'] });
        },
        onError: (err: any) => {
            alert(err.message);
        },
    });

    const deleteMoutation = useMutation({
        mutationFn: async (pollId: number) => {
            await fetch(`${API_URL}/polls/${pollId}`, {
                method: 'DELETE',
            })
        },
        onError: (err: any) => {
            alert(err.message);
        }
    })

    const voteMutation = useMutation({
        mutationFn: async ({ pollId, optionId }: { pollId: number; optionId: number }) => {
            const res = await fetch(`${API_URL}/polls/${pollId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ optionId, voterId }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Vote failed');
            }
        },
        onError: (err: any) => {
            alert(err.message);
        },
    });

    // TODO: move socket keys to a turborepo package
    useEffect(() => {
        const socket = io(API_URL);
        socket.on('pollUpdate', (updatedPoll: Poll) => {
            setPolls((prev) =>
                prev.map((poll) => (poll.id === updatedPoll.id ? updatedPoll : poll))
            );
        });

        socket.on('pollCreate', (newPoll: Poll) => {
            setPolls((prev) => {
                const alreadyExists = prev.some(p => p.id === newPoll.id);
                return alreadyExists ? prev : [...prev, newPoll];
            });
        });

        socket.on('pollDelete', (pollId: number) => {
            setPolls((prev) => {
                return prev.filter((poll) => poll.id !== pollId)
            })
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    return { polls, isLoading, voteMutation, createMutation, deleteMoutation };
};
