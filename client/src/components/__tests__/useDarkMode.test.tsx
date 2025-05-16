import { renderHook, act } from '@testing-library/react';
import useDarkMode from '../../hooks/useDarkMode';

describe('useDarkMode', () => {
  const matchMediaMock = (matches: boolean) =>
    jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('defaults to system preference when no localStorage is set', () => {
    window.matchMedia = matchMediaMock(true); // system prefers dark
    const { result } = renderHook(() => useDarkMode());

    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('uses stored theme from localStorage (light)', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current[0]).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('updates to dark mode when toggled', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current[1](true)); // setIsDark(true)

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('updates to light mode when toggled', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current[1](false)); // setIsDark(false)

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
