import type { Preview } from '@storybook/nextjs-vite';
import { ThemeProvider, useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import '../app/globals.css';

function ThemeSync({ theme }: { theme: string }) {
  const { setTheme } = useTheme()

  useEffect(() => {
    console.log(theme)
    setTheme(theme)
  }, [setTheme, theme])

  return null
};

const ThemeWrapper = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: 'light' | 'dark';
}) => {
  const { setTheme } = useTheme();
  useEffect(() => {
    console.log('mount')
  }, [])

  useEffect(() => {
    setTheme(theme)
  }, [setTheme, theme])


  // useEffect(() => {
  //   // HTML root에 테마 클래스 적용
  //   const root = document.documentElement;
  //   root.classList.remove('light', 'dark');
  //   root.classList.add(theme);

  //   console.log(root.classList);

  //   // body에도 배경색 적용
  //   document.body.style.backgroundColor = theme === 'dark' ? '#09090b' : '#ffffff';
  //   document.body.style.color = theme === 'dark' ? '#fafafa' : '#09090b';
  // }, [theme]);

  return (
    <ThemeProvider
      key={theme}
      attribute="class"
      defaultTheme={theme}
      forcedTheme={theme}
      enableSystem
    >
      <div className="bg-background text-foreground p-4">
        {children}
      </div>
    </ThemeProvider>
  );
};

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
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <ThemeSync theme={context.globals.theme || 'light'} />
        <Story />
      </ThemeProvider>
    )},
  ],
};

export default preview;
