import type { FieldGuidePanelProps } from "./FieldGuidePanel.types";

const DEFAULT_TITLE = "Field guide";
const DEFAULT_DESCRIPTION =
  "Each form control is linked to its matching note here so the guidance stays visible without crowding the form.";

export const FieldGuidePanel = ({
  description = DEFAULT_DESCRIPTION,
  sections,
  title = DEFAULT_TITLE,
}: FieldGuidePanelProps) => {
  return (
    <div className="border-border bg-surface-alt/75 rounded-3xl border px-5 py-5">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        <p className="text-text-muted text-sm leading-6">{description}</p>
      </div>
      <div className="mt-5 space-y-5">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h3 className="eyebrow">{section.title}</h3>
            <dl className="space-y-3">
              {section.entries.map((entry) => (
                <div key={entry.id} className="space-y-1">
                  <dt className="text-sm font-semibold text-white">{entry.fieldLabel}</dt>
                  <dd className="text-text-muted text-sm leading-6" id={entry.id}>
                    {entry.text}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
};
