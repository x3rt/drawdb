import { createContext, useEffect, useState } from "react";
import { tableWidth } from "../data/constants";

const defaultSettings = {
  strictMode: false,
  showFieldSummary: true,
  showGrid: true,
  snapToGrid: false,
  showDataTypes: true,
  mode: "light",
  autosave: true,
  showCardinality: true,
  showRelationshipLabels: true,
  tableWidth: tableWidth,
  showDebugCoordinates: false,
  showComments: false,
};

export const SettingsContext = createContext(defaultSettings);

function getInitialSettings() {
  try {
    const settings = localStorage.getItem("settings");
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function SettingsContextProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  useEffect(() => {
    document.body.setAttribute("theme-mode", settings.mode);
  }, [settings.mode]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
