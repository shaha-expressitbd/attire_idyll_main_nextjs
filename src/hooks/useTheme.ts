import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setThemeColor,
  toggleThemeMode,
} from "../lib/features/theme/themeSlice";

const useTheme = () => {
  const dispatch = useDispatch();
  const { mode, color } = useSelector((state: RootState) => state.theme);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";

    // 1️⃣ Update Redux state
    dispatch(toggleThemeMode());

    // 2️⃣ Instantly update <html> class so Tailwind dark classes flip immediately
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newMode === "dark");
    }
  };

  const changeColor = (newColor: RootState["theme"]["color"]) => {
    dispatch(setThemeColor(newColor));
  };

  return { mode, color, toggleMode, changeColor };
};

export default useTheme;
