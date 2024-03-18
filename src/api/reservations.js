import { useQuery } from '@tanstack/react-query';

import { client } from './client';

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await client.get('/api/reservations');
      return response.data;
    },
  });
};
