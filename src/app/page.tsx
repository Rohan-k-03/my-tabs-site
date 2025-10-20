"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Cookies from "js-cookie";
import { buildStandaloneMarkup } from "@/lib/tabMarkup";

const TabsGenerator: React.FC = () => {
  const [tabLabels, setTabLabels] = useState<string[]>(["Tab 1", "Tab 2"]);
  const [tabContents, setTabContents] = useState<string[]>(["Content 1", "Content 2"]);
  const [generatedMarkup, setGeneratedMarkup] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [showMarkup, setShowMarkup] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const savedIndex = Cookies.get("selectedTabIndex");
    if (savedIndex !== undefined) {
      setActiveTab(parseInt(savedIndex, 10));
    }
  }, []);

  const updateLabel = (index: number, value: string) => {
    const updatedLabels = [...tabLabels];
    updatedLabels[index] = value;
    setTabLabels(updatedLabels);
  };

  const updateContent = (index: number, value: string) => {
    const updatedContents = [...tabContents];
    updatedContents[index] = value;
    setTabContents(updatedContents);
  };

  const addTab = () => {
    setTabLabels(prev => [...prev, `Tab ${prev.length + 1}`]);
    setTabContents(prev => [...prev, `Content ${prev.length + 1}`]);
  };

  const selectTab = (index: number) => {
    setActiveTab(index);
    Cookies.set("selectedTabIndex", index.toString());
  };

  const handleKeyNav = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    let newIndex = activeTab;
    if (e.key === "ArrowRight") {
      newIndex = (activeTab + 1) % tabLabels.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      newIndex = (activeTab - 1 + tabLabels.length) % tabLabels.length;
      e.preventDefault();
    } else if (e.key === "Home") {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      newIndex = tabLabels.length - 1;
      e.preventDefault();
    }
    if (newIndex !== activeTab) {
      selectTab(newIndex);
      tabRefs.current[newIndex]?.focus();
    }
  };

  const generateMarkup = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const finalOutput = buildStandaloneMarkup(tabLabels, tabContents, activeTab);

      setGeneratedMarkup(finalOutput);
      setCopied(false);
      setShowMarkup(true);
      setIsGenerating(false);
    }, 800);
  };

  const copyMarkup = () => {
    if (textareaRef.current) {
      navigator.clipboard.writeText(generatedMarkup);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: easeOut },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex flex-col p-4 md:p-6 pt-6 md:pt-8 text-gray-900 dark:bg-transparent dark:text-white transition-colors duration-200 pb-20 mx-auto w-full max-w-6xl"
    >
      <motion.h1
        variants={itemVariants}
        className="texty mb-4 text-center font-extrabold tracking-wide text-gray-900 dark:text-white"
        style={{
          letterSpacing: "0.06em",
          fontSize: "clamp(2rem, 5vw, 2.75rem)",
          lineHeight: 1.15,
          wordBreak: "keep-all",
          whiteSpace: "pre-line",
        }}
        aria-label="Custom Tab Generator"
      >
        {"Custom Tab Generator"
          .split(" ")
          .map((word, wIdx) => (
            <span key={wIdx} style={{ display: "inline-block", marginRight: "0.5ch" }}>
              {word.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: (wIdx * 7 + i) * 0.03,
                    type: "spring",
                    stiffness: 400,
                    damping: 16,
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
      </motion.h1>

      <motion.div variants={itemVariants} className="mb-5">
        {tabLabels.map((label, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mb-3 flex flex-col md:flex-row gap-3"
          >
            <input
              type="text"
              value={label}
              onChange={e => updateLabel(i, e.target.value)}
              className="w-full md:w-48 rounded-lg border border-gray-300 p-3 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder={`Label ${i + 1}`}
            />
            <input
              type="text"
              value={tabContents[i]}
              onChange={e => updateContent(i, e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder={`Content ${i + 1}`}
            />
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 2px 8px rgb(59 130 246 / 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={addTab}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Add tab"
        >
          Add tab
        </motion.button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-start">
        <div className="flex-1">
          <motion.div variants={itemVariants} className="mb-4 flex flex-wrap gap-2">
            {tabLabels.map((label, i) => (
              <motion.button
                key={i}
                ref={el => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${i}`}
                role="tab"
                aria-selected={activeTab === i}
                aria-controls={`panel-${i}`}
                tabIndex={activeTab === i ? 0 : -1}
                onClick={() => selectTab(i)}
                onKeyDown={handleKeyNav}
                whileHover={{ y: -1, boxShadow: "0 1px 6px rgb(96 165 250 / 0.3)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 280, damping: 22 }}
                className={`text-sm md:text-base px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === i
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {showMarkup && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="mb-6 mt-2 min-h-[120px] rounded-lg border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {tabContents[activeTab]}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 3px 9px rgb(22 163 74 / 0.35)" }}
              whileTap={{ scale: 0.96 }}
              onClick={generateMarkup}
              disabled={isGenerating}
              className="w-full rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 sm:w-auto transition-colors flex items-center justify-center gap-2"
              aria-label="Generate Markup"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Markup"
              )}
            </motion.button>

            {generatedMarkup && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 6px rgb(107 114 128 / 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMarkup(s => !s)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto transition-colors"
                aria-label={showMarkup ? "Hide HTML" : "Show HTML"}
              >
                {showMarkup ? "Hide HTML" : "Show HTML"}
              </motion.button>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {showMarkup && generatedMarkup && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex w-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800 lg:max-w-[50%] lg:mt-6"
              aria-label="Generated markup preview panel"
            >
              <div className="mb-3 flex items-center justify-between pb-1">
                <label
                  htmlFor="generated-code"
                  className="texty text-gray-700 text-sm font-medium dark:text-gray-300"
                >
                  Exported HTML
                </label>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  HTML
                </span>
              </div>
              <p className="texty mb-3 text-sm font-normal text-gray-600 dark:text-gray-400">
                Save as{" "}
                <code className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300 dark:bg-gray-600">
                  Hello.html
                </code>{" "}
                and open in a browser.
              </p>
              <textarea
                id="generated-code"
                readOnly
                ref={textareaRef}
                rows={12}
                value={generatedMarkup}
                onFocus={e => e.currentTarget.select()}
                aria-label="Generated HTML code"
                className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[220px]"
              />
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={copyMarkup}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:focus:ring-offset-transparent sm:w-auto"
                aria-label="Copy HTML to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copied ? "Copied to clipboard" : "Copy HTML"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TabsGenerator;
