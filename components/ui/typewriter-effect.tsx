import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex].text;
    
    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000); // Wait 2 seconds before starting to delete
      
      return () => clearTimeout(waitTimer);
    }

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        const deleteTimer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        }, 40);
        return () => clearTimeout(deleteTimer);
      }
    } else {
      if (currentText === currentWord) {
        setIsWaiting(true);
      } else {
        const typeTimer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, 40);
        return () => clearTimeout(typeTimer);
      }
    }
  }, [currentText, currentWordIndex, isDeleting, isWaiting, words]);

  return (
    <div className={cn("flex items-center justify-center ", className)}>
      <div className="max-w-2xl">
        <div className="flex items-center">
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-400 font-inter min-h-[1.5rem]">
            {currentText}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className={cn(
              "ml-1 inline-block w-[4px] h-5 sm:h-5 md:h-5 bg-white",
              cursorClassName
            )}
          ></motion.span>
        </div>
      </div>
    </div>
  );
};