"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const preLabQuestions = [
  "Did you scaffold with create-next-app (TypeScript, App Router)?",
  "Can you run the site locally and see Home/About/Escape-Room/Coding-Races/Court-Room? (Yes/No)",
  "Do you have a Header with a menu (hamburger/kebab on mobile)? (Yes/No)",
  "Is Dark/Light theme implemented site-wide? (Yes/No)",
  "Does the Footer show your name, student number, date? (Yes/No)",
  "Can you navigate all pages with keyboard only?",
  "Does the site remember the last menu/tab you were on (cookie/localStorage)? Briefly how?",
  "Does About include your name, student number, and a short how-to video?",
  "On Home, does your app output copyable HTML5 + JS with inline CSS (no classes)? (Yes/No; paste a tiny snippet)",
  "Are Escape Room / Coding Races / Court Room present (OK if empty placeholders)? (Yes/No)",
  "Do you have GitHub commits (screenshots later for submission)? (Yes/No)",
  "Can you provide the code ZIP (without node_modules) and a short walkthrough video? (Yes/No)",
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
    className="app-content min-h-screen p-6 pt-20 bg-inherit font-sans"
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
