import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "english");
  const [font, setFont] = useState(localStorage.getItem("font") || "default");

  // Apply theme + font globally when changed
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    document.body.style.fontFamily =
      font === "default"
        ? "Montserrat, sans-serif"
        : font === "arial"
        ? "Arial, sans-serif"
        : "Roboto, sans-serif";

    // Save preferences
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
    localStorage.setItem("font", font);
  }, [theme, language, font]);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, language, setLanguage, font, setFont }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
