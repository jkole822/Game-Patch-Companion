import { Button, Container } from "@/components";
import { getClassName } from "@/lib/utils";

import type { CollectionsPageLayoutProps } from "./CollectionsPageLayout.types";

import "./CollectionsPageLayout.css";

export const CollectionsPageLayout = ({
  children,
  className,
  createHref,
  description,
  eyebrow,
  gridClassName,
  icon: Icon,
  leftPanelContent,
  partialData,
  resourceLabelPlural,
  resourceLabelSingular,
  rightPanelContent,
  rightPanelEyebrow,
  rightPanelTitle,
  title,
}: CollectionsPageLayoutProps) => {
  return (
    <main
      className={getClassName("collections-page-layout__main", className)}
      style={{ backgroundImage: "url(/gpc-background.png)" }}
    >
      <div className="collections-page-layout__gradient" />
      <div className="page-margins collections-page-layout__main-content">
        <section className={getClassName("collections-page-layout__grid", gridClassName)}>
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-10">
            <div className="collections-page-layout__left-panel">
              <div className="max-w-2xl space-y-4">
                <div className="collections-page-layout__left-panel-eyebrow">
                  <Icon className="size-3.5" />
                  {eyebrow}
                </div>
                <div className="space-y-3">
                  <h1 className="hs-1">{title}</h1>
                  <p className="collections-page-layout__description">{description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href={createHref}>Create {resourceLabelSingular}</Button>
                <Button href="/dashboard">Back to dashboard</Button>
              </div>
            </div>

            {partialData && (
              <div className="collections-page-layout__warning">
                Some {resourceLabelPlural} data could not be loaded, so this view may be incomplete.
              </div>
            )}

            {leftPanelContent}
          </Container>
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="space-y-2">
              <p className="eyebrow">{rightPanelEyebrow}</p>
              <h2 className="hs-2">{rightPanelTitle}</h2>
            </div>

            {rightPanelContent}
          </Container>
        </section>
        {children}
      </div>
    </main>
  );
};
