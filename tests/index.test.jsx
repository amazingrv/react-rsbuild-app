import { expect, test } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import App from '../src/app/App';

test('renders the main page', () => {
  const testMessage = 'Click on the React logo to learn more';
  render(<App />);
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});
