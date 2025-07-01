import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '#/App.svelte';

describe('App', () => {
  beforeEach(() => {
    render(App);
  });

  it('Should render a canvas', () => {
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
