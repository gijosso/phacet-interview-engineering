import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [texts]);

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {texts.map((text, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            transition={{ duration: 0.5 }}
          >
            {text}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedText;
