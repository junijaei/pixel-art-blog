import type { Preview } from '@storybook/nextjs-vite';
import { ThemeProvider, useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import '../app/globals.css';

function ThemeSync({ theme }: { theme: string }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeSync theme={context.globals.theme || 'light'} />
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
