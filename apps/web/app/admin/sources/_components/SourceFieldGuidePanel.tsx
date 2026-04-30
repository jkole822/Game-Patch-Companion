import { SOURCE_FIELD_GUIDE, SOURCE_FIELD_GUIDE_GROUPS } from "./SourceFieldGuide";

export const SourceFieldGuidePanel = () => {
  return (
    <div className="border-border bg-surface-alt/75 rounded-3xl border px-5 py-5">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-white">Field guide</h2>
        <p className="text-text-muted text-sm leading-6">
          Each form control is linked to its matching note here so the guidance stays visible
          without crowding the form.
        </p>
      </div>
      <div className="mt-5 space-y-5">
        {SOURCE_FIELD_GUIDE_GROUPS.map((group) => (
          <section key={group.title} className="space-y-3">
            <h3 className="eyebrow">{group.title}</h3>
            <dl className="space-y-3">
              {group.fields.map((fieldKey) => {
                const field = SOURCE_FIELD_GUIDE[fieldKey];

                return (
                  <div key={field.id} className="space-y-1">
                    <dt className="text-sm font-semibold text-white">{field.fieldLabel}</dt>
                    <dd className="text-text-muted text-sm leading-6" id={field.id}>
                      {field.text}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
};
