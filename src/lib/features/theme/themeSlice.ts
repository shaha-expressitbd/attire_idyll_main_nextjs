import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";
type ThemeColor = "toolbox" | "red" | "green" | "blue" | "sage" | "orange";

type ThemeState = {
  mode: ThemeMode;
  color: ThemeColor;
};

const initialState: ThemeState = {
  mode: "light",
  color: "toolbox",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      console.log(
        "themeSlice setThemeMode:",
        action.payload,
        "isServer:",
        typeof window === "undefined"
      );
      state.mode = action.payload;
    },
    setThemeColor: (state, action: PayloadAction<ThemeColor>) => {
      state.color = action.payload;
    },
    toggleThemeMode: (state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      console.log(
        "themeSlice toggleThemeMode from:",
        state.mode,
        "to:",
        newMode,
        "isServer:",
        typeof window === "undefined"
      );
      state.mode = newMode;
    },
  },
});

export const { setThemeMode, setThemeColor, toggleThemeMode } =
  themeSlice.actions;
export default themeSlice.reducer;
