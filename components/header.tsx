import Link from "next/link";
import { useMemo } from "react";
import { Sun, Moon } from "react-feather";

import { useDarkMode } from "../lib/theme";

export default function Header() {
  const [theme, switchTheme] = useDarkMode();
  const isDark = useMemo(() => theme === "dark", [theme]);
  return (
    <header className="flex items-center justify-between my-4 mx-6">
      <Link href="/">
        <a className="text-xl font-bold shine">COWIN DIRECTORY</a>
      </Link>
      <button
        type="button"
        onClick={() => (isDark ? switchTheme("light") : switchTheme("dark"))}
        className="focus:outline-none outline-none shine"
      >
        {isDark ? <Sun /> : <Moon />}
      </button>
    </header>
  );
}
