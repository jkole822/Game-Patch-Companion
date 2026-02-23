import * as Icons from "lucide-react";

import { getClassName } from "@/lib/utils";

import type { FeatureCardProps } from "./FeatureCard.types";
import "./FeatureCard.css";

export const FeatureCard = ({ className, description, icon, title }: FeatureCardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Icons are dynamically imported.
  const Icon = icon ? (Icons as any)[icon] : undefined;

  return (
    <article className={getClassName("feature-card group", className)}>
      <div className="feature-card__glow" />

      <span className="feature-card__corner feature-card__corner--top-left" />
      <span className="feature-card__corner feature-card__corner--top-right" />
      <span className="feature-card__corner feature-card__corner--bottom-left" />
      <span className="feature-card__corner feature-card__corner--bottom-right" />

      <div className="feature-card__content">
        {Boolean(Icon) && (
          <div className="feature-card__icon">
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}
        {Boolean(title) && Boolean(description) && (
          <div className="feature-card__text">
            {Boolean(title) && <h3 className="feature-card__title">{title}</h3>}
            {Boolean(description) && <p className="feature-card__description">{description}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
