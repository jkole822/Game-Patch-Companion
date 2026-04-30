import type { SourceFeature } from "../sources.types";

type SourceFeatureGridProps = {
  features: SourceFeature[];
};

export const SourceFeatureGrid = ({ features }: SourceFeatureGridProps) => {
  return (
    <div className="space-y-4">
      {features.map(({ description, icon: Icon, title }) => (
        <div className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5" key={title}>
          <div className="flex items-start gap-3">
            <Icon className="text-primary-light mt-0.5 size-5" />
            <div className="space-y-2">
              <h3 className="hs-3">{title}</h3>
              <p className="text-text-muted text-sm leading-6">{description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
