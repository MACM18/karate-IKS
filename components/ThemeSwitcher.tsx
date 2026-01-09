"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
            <Sun className="h-5 w-5 block dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
