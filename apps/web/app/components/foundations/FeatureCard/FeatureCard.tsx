import type { FeatureCardProps } from "./FeatureCard.types";

import { getClassName } from "@/lib/utils";

import "./FeatureCard.css";

export const FeatureCard = ({ className, description, icon, title }: FeatureCardProps) => {
  return (
    <article className={getClassName("feature-card group", className)}>
      <div className="feature-card__glow" />

      <span className="feature-card__corner feature-card__corner--top-left" />
      <span className="feature-card__corner feature-card__corner--top-right" />
      <span className="feature-card__corner feature-card__corner--bottom-left" />
      <span className="feature-card__corner feature-card__corner--bottom-right" />

      <div className="feature-card__content">
        <div className="feature-card__icon">{icon}</div>
        <div className="feature-card__text">
          <h3 className="feature-card__title">{title}</h3>
          <p className="feature-card__description">{description}</p>
        </div>
      </div>
    </article>
  );
};
