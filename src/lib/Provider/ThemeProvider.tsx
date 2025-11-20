"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode, color } = useSelector((state: RootState) => state.theme);

  console.log('ThemeProvider render - mode:', mode, 'color:', color, 'isServer:', typeof window === 'undefined');

  useEffect(() => {
    console.log('ThemeProvider useEffect - setting className to:', `${mode} ${color}`);
    document.documentElement.className = `${mode} ${color}`;
  }, [mode, color]);

  return <>{children}</>;
};
