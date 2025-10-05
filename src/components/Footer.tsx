"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const [displayedText, setDisplayedText] = useState("");
  const dateString = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const studentInfo = "© Rohan Khurana, 21358295";

  useEffect(() => {
    let currentIndex = 0;
    const fullText = `${studentInfo} - ${dateString}`;
    const timer = setInterval(() => {
      currentIndex++;
      setDisplayedText(fullText.slice(0, currentIndex));
      if (currentIndex === fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [dateString, studentInfo]);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t p-3 text-center text-black dark:text-white"
      style={{ fontWeight: 500, letterSpacing: "0.04em" }}
      aria-label="Footer information"
    >
      <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm text-black/80 dark:text-gray-200">
        {displayedText}
      </span>
    </motion.footer>
  );
};

export default Footer;
