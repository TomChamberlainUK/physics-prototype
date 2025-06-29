import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App.svelte';

describe('App', () => {
  beforeEach(() => {
    render(App);
  });

  it('Should render', () => {
    const text = screen.getByText('Hello, World!');
    expect(text).toBeInTheDocument();
  });
});
