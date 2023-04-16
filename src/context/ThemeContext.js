import { createContext, useReducer } from "react";

const ThemeContext = createContext();

const initialValue = { theme: localStorage.getItem("theme") || "light" };
const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return { ...state, theme: action.newValue };
    default:
      return state;
  }
};

export function ThemeProvider({ children }) {
  const [themeMode, dispatch] = useReducer(reducer, initialValue);

  const toggleTheme = (theme) => {
    dispatch({
      type: "TOGGLE_THEME",
      newValue: theme,
    });
    localStorage.setItem("theme", theme)
  };

  return (
    <ThemeContext.Provider value={{ ...themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;