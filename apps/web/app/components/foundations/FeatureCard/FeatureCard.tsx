import * as Icons from "lucide-react";

import type { FeatureCardProps } from "./FeatureCard.types";

import { getClassName } from "@/lib/utils";

import "./FeatureCard.css";

export const FeatureCard = ({ className, description, icon, title }: FeatureCardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Icons are dynamically imported.
  const Icon = (Icons as any)[icon];

  return (
    <article className={getClassName("feature-card group", className)}>
      <div className="feature-card__glow" />

      <span className="feature-card__corner feature-card__corner--top-left" />
      <span className="feature-card__corner feature-card__corner--top-right" />
      <span className="feature-card__corner feature-card__corner--bottom-left" />
      <span className="feature-card__corner feature-card__corner--bottom-right" />

      <div className="feature-card__content">
        <div className="feature-card__icon">
          <Icon size={22} strokeWidth={2.2} />
        </div>
        <div className="feature-card__text">
          <h3 className="feature-card__title">{title}</h3>
          <p className="feature-card__description">{description}</p>
        </div>
      </div>
    </article>
  );
};
