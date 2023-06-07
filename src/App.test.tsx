import { render, screen } from '@testing-library/react';
import mockChannels from './mocks/channels.json';
import App from './App';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: mockChannels })
  })
) as jest.Mock;

test('renders page elements', () => {
  jest.useFakeTimers();
  render(<App />);

  expect(
    screen.getByRole('button', {
      name: /now/i
    })
  ).toBeInTheDocument();

  const table = screen.getByRole('table');

  expect(table).toBeInTheDocument();
});
