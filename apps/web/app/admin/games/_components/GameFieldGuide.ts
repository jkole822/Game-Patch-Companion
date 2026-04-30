export const GAME_FIELD_GUIDE = {
  title: {
    fieldLabel: "Title",
    id: "game-field-guide-title",
    text: "Human-readable game title shown throughout dashboards, watchlists, and admin tools.",
  },
  key: {
    fieldLabel: "Key",
    id: "game-field-guide-key",
    text: "Stable machine key for integrations and internal references. Use lowercase letters, numbers, and dashes only.",
  },
} as const;

export const GAME_FIELD_GUIDE_GROUPS = [
  {
    title: "Basics",
    fields: ["title", "key"] as const,
  },
] as const;

export const GAME_FIELD_GUIDE_SECTIONS = GAME_FIELD_GUIDE_GROUPS.map((group) => ({
  entries: group.fields.map((fieldKey) => GAME_FIELD_GUIDE[fieldKey]),
  title: group.title,
}));
