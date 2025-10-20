"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const preLabQuestions = [
  "Project created with create-next-app (TypeScript, App Router)",
  "App runs locally and all pages load (Home, About, Escape Room, Coding Races, Court Room)",
  "Header includes a responsive menu (hamburger on mobile)",
  "Light/dark theme works across the site",
  "Footer shows name, student number and date",
  "Keyboard-only navigation works throughout",
  "Site remembers the last menu and active tab (cookie/localStorage)",
  "About page includes name, student number and a short how‑to video",
  "Home page can export a single HTML file (inline CSS + JS)",
  "Escape Room / Coding Races / Court Room pages are present (placeholders are fine)",
  "Repository has regular commits",
  "Can provide a ZIP (without node_modules) and a short walkthrough video",
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, when: "beforeChildren" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    textDecoration: "underline",
    transition: { duration: 0.25 }
  },
  tap: { scale: 0.95 },
};

const PreLab: React.FC = () => (
  <motion.div
    className="app-content min-h-screen p-6 pt-20 bg-inherit font-sans mx-auto w-full max-w-6xl"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1
      variants={itemVariants}
      className="texty mb-6 text-3xl font-semibold text-gray-900 dark:text-white tracking-tight"
    >
      Pre-lab Questions
    </motion.h1>
    <motion.ul
      variants={containerVariants}
      className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
      aria-label="Pre-lab Questions"
    >
      {preLabQuestions.map((question, idx) => (
        <motion.li
          key={idx}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className="cursor-pointer texty"
          tabIndex={0}
        >
          {question}
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
);

export default PreLab;
