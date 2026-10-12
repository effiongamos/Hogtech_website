import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 active:scale-95 flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200 shadow-sm'
          : 'bg-slate-800/60 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white shadow-sm'
      } ${className}`}
      aria-label={
        theme === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme'
      }
      title={
        theme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle dark or light theme</span>
    </button>
  );
};
