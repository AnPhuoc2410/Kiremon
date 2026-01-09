import React from "react";
import { useTCGCards } from "../../../hooks/useTCG";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ITCGCard } from "../../../services/tcg";

const TCGTab: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { data: cards, isLoading, error } = useTCGCards(name || "");

  if (!name) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        Error loading cards. Please try again later.
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        No TCG cards found for this Pokemon.
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
        Pokemon TCG Cards ({cards.length})
      </h3>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={item}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
          >
            <div className="relative aspect-[0.715] w-full overflow-hidden">
              <img
                src={card.images.small}
                alt={card.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h4 className="truncate font-semibold text-gray-800 dark:text-gray-200">
                {card.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{card.set.name}</span>
                {card.set.images.symbol && (
                  <img
                    src={card.set.images.symbol}
                    alt={card.set.name}
                    className="h-4 w-4 object-contain"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TCGTab;
