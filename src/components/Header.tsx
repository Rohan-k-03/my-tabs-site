"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { motion, AnimatePresence, easeOut, Variants } from "framer-motion";

const NAV_ITEMS = [
  { label: "Tabs", path: "/" },
  { label: "Pre‑Lab", path: "/pre-lab" },
  { label: "Escape Room", path: "/escape-room" },
  { label: "Coding Races", path: "/coding-races" },
  { label: "Court Room", path: "/court-room" },
  { label: "About", path: "/about" },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
  hover: {
    scale: 1.05,
    color: "#d97706",
    transition: { type: "spring", stiffness: 300 },
  },
  tap: { scale: 0.95 },
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>("/");
  const STUDENT_ID = "21358295";
  const displayedId = STUDENT_ID;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = Cookies.get("selectedNav");
    if (saved) setActivePath(saved);
  }, []);

  useEffect(() => {
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const htmlElement = document.documentElement;
    if (storedTheme === "dark") {
      setDarkMode(true);
      htmlElement.classList.add("dark");
      htmlElement.classList.remove("light");
    } else {
      setDarkMode(false);
      htmlElement.classList.add("light");
      htmlElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const htmlElement = document.documentElement;
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        htmlElement.classList.add("dark");
        htmlElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        htmlElement.classList.remove("dark");
        htmlElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  const handleNavClick = (path: string) => {
    setActivePath(path);
    Cookies.set("selectedNav", path);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 border-b p-0 text-black dark:text-white"
      aria-label="Main header with navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 min-w-0">
          <motion.div
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              href="/"
              aria-label="Go to Home via Student ID"
              onClick={() => handleNavClick("/")}
              className={`id-chip inline-flex items-center gap-1 rounded bg-gray-200/80 backdrop-blur px-2.5 py-1.5 font-medium text-sm text-gray-700 dark:bg-gray-800/70 dark:text-gray-200 border border-gray-300/50 dark:border-gray-700/50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 hover:underline underline-offset-4 ${
                activePath === "/"
                  ? "font-semibold text-amber-700 dark:text-amber-400 underline decoration-2 underline-offset-4"
                  : ""
              }`}
            >
              Student ID: {displayedId}
            </Link>
          </motion.div>

          <nav
            className="hidden space-x-6 md:flex"
            role="navigation"
            aria-label="Primary Navigation"
          >
            {NAV_ITEMS.map(({ label, path }, i) => (
              <motion.div
                key={path}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href={path}
                  aria-current={activePath === path ? "page" : undefined}
                  onClick={() => handleNavClick(path)}
                  className={`rounded-md px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                    activePath === path
                      ? "font-semibold text-amber-700 dark:text-amber-400 underline decoration-2 underline-offset-4"
                      : "hover:underline underline-offset-4"
                  }`}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            aria-label="Toggle Dark Mode"
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="hidden md:inline-flex rounded-full bg-gray-200/80 backdrop-blur p-2 shadow text-lg text-gray-700 dark:bg-gray-700/70 dark:text-gray-200 border border-amber-200/60 dark:border-amber-900/40"
          >
            {darkMode ? "🌙" : "☀️"}
          </motion.button>

          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="md:hidden focus:outline-none"
          >
            <motion.svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              initial={false}
              animate={{ rotate: isMenuOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {isMenuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z"
                />
              ) : (
                <>
                  <path d="M4 6h16v2H4V6z" />
                  <path d="M4 11h16v2H4v-2z" />
                  <path d="M4 16h16v2H4v-2z" />
                </>
              )}
            </motion.svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="menu-panel absolute top-full left-0 right-0 border-t md:hidden"
            role="menu"
            aria-label="Mobile Navigation"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { height: 0, opacity: 0 },
              visible: {
                height: "auto",
                opacity: 1,
                transition: { duration: 0.3, ease: easeOut },
              },
            }}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col space-y-3 p-4">
              <li className="pb-2 mb-1 border-b border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    aria-label="Go to Home via Student ID"
                    onClick={() => handleNavClick("/")}
                    className={`id-chip inline-flex items-center gap-1 rounded bg-gray-200/70 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800/70 dark:text-gray-200 border border-gray-300/50 dark:border-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 hover:underline underline-offset-4 ${
                      activePath === "/" ? "font-bold underline text-amber-700 dark:text-amber-400" : ""
                    }`}
                  >
                    Student ID: {displayedId}
                  </Link>
                  <button
                    aria-label="Toggle Dark Mode"
                    onClick={toggleDarkMode}
                    className="rounded-full bg-gray-200/80 p-2 text-base text-gray-700 dark:bg-gray-700/70 dark:text-gray-200 border border-amber-200/60 dark:border-amber-900/40"
                  >
                    {darkMode ? "🌙" : "☀️"}
                  </button>
                </div>
              </li>
              {NAV_ITEMS.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    aria-current={activePath === path ? "page" : undefined}
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => handleNavClick(path)}
                    className={`block rounded-md px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                      activePath === path
                        ? "font-bold underline text-amber-700 dark:text-amber-400"
                        : "hover:underline text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* std id */}
    </motion.header>
  );
};

export default Header;
