"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";

const TYPE_SPEED = 40; 
const TEXTS = {
  heading: "About Me",
  name: "Name: Rohan Khurana",
  studentId: "Student ID: 21358295",
  description:
    "This page is part of my HTML5 Tabs Generator assignment. It gives a quick overview and a short walkthrough video.",
  howToUseHeading: "How to Use This Site",
  howToUseText:
    "Use the generator on the home page to add tab labels and content. When you're ready, export a single self‑contained file and open it in your browser. If you like, save it as Hello.html.",
};

const About: React.FC = () => {
  const [typedHeading, setTypedHeading] = useState("");
  const [typedName, setTypedName] = useState("");
  const [typedStudentId, setTypedStudentId] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [typedHowToUseHeading, setTypedHowToUseHeading] = useState("");
  const [typedHowToUseText, setTypedHowToUseText] = useState("");

  const typeWriter = (
    text: string,
    updateFunc: React.Dispatch<React.SetStateAction<string>>,
    startDelay = 0
  ) => {
    let charIndex = 0;
    setTimeout(() => {
      const intervalId = setInterval(() => {
        updateFunc(text.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= text.length) clearInterval(intervalId);
      }, TYPE_SPEED);
    }, startDelay);
  };

  useEffect(() => {
    const headingDelay = 0;
    const nameDelay = TEXTS.heading.length * TYPE_SPEED + 300;
    const studentIdDelay = nameDelay + TEXTS.name.length * TYPE_SPEED + 300;
    const descDelay = studentIdDelay + TEXTS.studentId.length * TYPE_SPEED + 300;
    const howToHeadingDelay =
      descDelay + TEXTS.description.length * TYPE_SPEED + 300;
    const howToTextDelay =
      howToHeadingDelay + TEXTS.howToUseHeading.length * TYPE_SPEED + 400;

    typeWriter(TEXTS.heading, setTypedHeading, headingDelay);
    typeWriter(TEXTS.name, setTypedName, nameDelay);
    typeWriter(TEXTS.studentId, setTypedStudentId, studentIdDelay);
    typeWriter(TEXTS.description, setTypedDescription, descDelay);
    typeWriter(TEXTS.howToUseHeading, setTypedHowToUseHeading, howToHeadingDelay);
    typeWriter(TEXTS.howToUseText, setTypedHowToUseText, howToTextDelay);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, when: "beforeChildren" },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="app-content min-h-screen bg-inherit p-6 pt-20 font-sans flex justify-center"
    >
      <div className="w-full max-w-4xl mx-auto">
        <motion.h1
          variants={itemVariants}
          className="texty mb-6 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white"
          aria-label="About Me Heading"
        >
          {typedHeading}
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            |
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="texty mb-3 text-gray-700 dark:text-white font-medium text-lg"
          aria-label="Name"
        >
          {typedName}
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            |
          </motion.span>
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="texty mb-3 text-gray-700 dark:text-white font-medium text-lg"
          aria-label="Student ID"
        >
          {typedStudentId}
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            |
          </motion.span>
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="texty mb-8 max-w-3xl leading-relaxed text-gray-600 dark:text-white text-lg"
          aria-label="Description"
        >
          {typedDescription}
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            |
          </motion.span>
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="texty mb-5 text-3xl font-semibold text-gray-900 dark:text-white"
          aria-label="How to Use This Site Heading"
        >
          {typedHowToUseHeading}
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            |
          </motion.span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="texty mb-8 max-w-3xl leading-relaxed text-gray-600 dark:text-white text-lg"
          aria-label="How to Use This Site Text"
        >
          {typedHowToUseText.split("Hello.html").map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx !== arr.length - 1 && (
                <code className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300 dark:bg-gray-600">
                  Hello.html
                </code>
              )}
            </React.Fragment>
          ))}
        </motion.p>

        <motion.div
  variants={itemVariants}
  className="video-container mb-12 max-w-3xl overflow-hidden rounded-lg shadow-lg"
  style={{ aspectRatio: "16 / 9" }}
  aria-label="About Video"
>
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/XTvJ7_JTiGM?rel=0&modestbranding=1"
    title="Walkthrough video"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
</motion.div>
      </div>
    </motion.div>
  );
};

export default About;
