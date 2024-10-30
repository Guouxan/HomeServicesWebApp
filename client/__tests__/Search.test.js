import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Search from '../pages/search';

jest.mock('axios');
jest.mock('next/link', () => {
  return ({ children }) => children;
});

describe('Search component', () => {
  test('renders search form and displays results', async () => {
    const mockServices = [
      {
        _id: '1',
        name: 'House Cleaning',
        description: 'Professional house cleaning service',
        price: 100,
        covidRestrictions: 'Wear mask'
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockServices });

    render(<Search />);

    expect(screen.getByText('Search Services')).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText('Search services');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'cleaning' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('House Cleaning')).toBeInTheDocument();
      expect(screen.getByText('Professional house cleaning service')).toBeInTheDocument();
      expect(screen.getByText('Price: $100')).toBeInTheDocument();
      expect(screen.getByText('Covid-19 Restrictions: Wear mask')).toBeInTheDocument();
    });
  });
});
