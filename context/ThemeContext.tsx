import React, { createContext, useContext, useState } from "react";
import { COLORS, darkColors } from "../constants/theme";

const ThemeContext = createContext({
  colors: COLORS,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = isDark ? darkColors : COLORS;

  return (
    <ThemeContext.Provider value={{ colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
