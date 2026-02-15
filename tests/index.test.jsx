import { expect, test } from '@rstest/core';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../src/app/App';

test('renders the main page', () => {
  const testMessage = 'Click on the React logo to learn more';
  render(<App />);
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});

test('render main page and increment counter', () => {
  render(<App />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(button).toHaveTextContent('count is 1');
});
