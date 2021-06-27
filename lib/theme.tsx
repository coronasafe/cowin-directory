import { useState, useEffect } from "react";

const LOCALSTORAGE_KEY = "theme";
const DARK_KEY = "dark";
const LIGHT_KEY = "light";

function setInitialColorMode(
  darkKey = DARK_KEY,
  lightKey = LIGHT_KEY,
  themeStorageKey = LOCALSTORAGE_KEY
) {
  const userPreference =
    !!window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const colorMode =
    window.localStorage.getItem(themeStorageKey) ||
    (userPreference ? darkKey : lightKey);
  if (colorMode === darkKey) {
    document.body.classList.add(colorMode);
  }
}

const blockingSetInitialColorMode = `(${setInitialColorMode})(
  '${DARK_KEY}',
  '${LIGHT_KEY}',
  '${LOCALSTORAGE_KEY}',
)`;

export function ThemeScriptTag() {
  return (
    <script dangerouslySetInnerHTML={{ __html: blockingSetInitialColorMode }} />
  );
}

type Mode = string | null;

export const useDarkMode = (): [
  Mode,
  React.Dispatch<React.SetStateAction<Mode>>
] => {
  const [mode, setMode] = useState<Mode>(null);

  useEffect(() => {
    const userPreference =
      !!window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setMode(
      window.localStorage.getItem(LOCALSTORAGE_KEY) ||
        (userPreference ? DARK_KEY : LIGHT_KEY)
    );
  }, []);

  useEffect(() => {
    if (mode) {
      window.localStorage.setItem(LOCALSTORAGE_KEY, mode);
      const root = document.body;
      if (mode === DARK_KEY) {
        root.classList.add(DARK_KEY);
      } else {
        root.classList.remove(DARK_KEY);
      }
    }
  }, [mode]);

  return [mode, setMode];
};
