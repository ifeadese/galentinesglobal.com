import React, { useMemo } from "react";
import styles from "./card-carousel.module.scss";

interface Card {
  image?: string;
  imageAlt?: string;
  title?: string;
}

interface CardCarouselProps {
  cards: Card[];
  className?: string;
}

export const CardCarousel = ({ cards, className }: CardCarouselProps) => {
  // Memoize duplicated cards for seamless infinite scroll animation
  // This prevents recalculation on every render
  const duplicatedCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    return [...cards, ...cards];
  }, [cards]);

  // Early return for empty cards (after hooks)
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className={styles.carouselWrapper}>
      <div className={`${styles.cardCarousel} ${className || ''}`.trim()}>
        <div className={styles.carouselInner}>
          {duplicatedCards.map((card, index) => (
            <div
              key={`carousel-card-${index}`}
              className={styles.card}
              style={{
                backgroundImage: card.image ? `url(${card.image})` : 'none',
              }}
              role="img"
              aria-label={card.imageAlt || card.title || `Carousel image ${Math.floor(index % cards.length) + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;

