import { Button, Container } from "@/components";

import type { AdminCardGridProps } from "./AdminCardGrid.types";

export const AdminCardGrid = ({ items }: AdminCardGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(({ ctaHref, ctaLabel, description, icon: Icon, title }) => (
        <Container className="w-full" contentClassName="space-y-4 p-6" key={title}>
          <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className="text-primary-light size-5" />
          </div>
          <div className="space-y-2">
            <h2 className="hs-2">{title}</h2>
            <p className="text-text-muted text-sm leading-6">{description}</p>
          </div>
          {ctaHref && ctaLabel ? <Button href={ctaHref}>{ctaLabel}</Button> : null}
        </Container>
      ))}
    </div>
  );
};
