import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as CustomThemeProvider } from '../components/common/theme-provider';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {
    wrapper: ({ children }) => (
      <CustomThemeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CustomThemeProvider>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
