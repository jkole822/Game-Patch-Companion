export const SOURCE_FIELD_GUIDE = {
  name: {
    fieldLabel: "Name",
    id: "source-field-guide-name",
    text: "Human-readable source name shown in admin tools and dashboards.",
  },
  key: {
    fieldLabel: "Key",
    id: "source-field-guide-key",
    text: "Stable machine key. Use lowercase letters, numbers, and dashes only.",
  },
  baseUrl: {
    fieldLabel: "Base URL",
    id: "source-field-guide-base-url",
    text: "Root site or feed URL the ingest pipeline should treat as the source origin.",
  },
  type: {
    fieldLabel: "Type",
    id: "source-field-guide-type",
    text: "Choose HTML for scraped pages, RSS for feeds, or API for custom JSON config.",
  },
  isEnabled: {
    fieldLabel: "Enabled",
    id: "source-field-guide-enabled",
    text: "Turn this off to save the source without letting it participate in ingest runs yet.",
  },
  listPath: {
    fieldLabel: "List path",
    id: "source-field-guide-list-path",
    text: "Path appended to the base URL for the page that lists patch or news entries.",
  },
  entrySelector: {
    fieldLabel: "Entry selector",
    id: "source-field-guide-entry-selector",
    text: "CSS selector that matches each individual patch entry in the listing page.",
  },
  titleSelector: {
    fieldLabel: "Title selector",
    id: "source-field-guide-title-selector",
    text: "CSS selector, relative to an entry, that contains the patch title.",
  },
  linkSelector: {
    fieldLabel: "Link selector",
    id: "source-field-guide-link-selector",
    text: "CSS selector, relative to an entry, that points to the entry link. `a` works for most lists.",
  },
  publishedAtSelector: {
    fieldLabel: "Published selector",
    id: "source-field-guide-published-selector",
    text: "CSS selector, relative to an entry, for the element that contains the publish timestamp.",
  },
  publishedAtAttribute: {
    fieldLabel: "Published attribute",
    id: "source-field-guide-published-attribute",
    text: "Attribute to read from the published element, such as `datetime`.",
  },
  contentSelector: {
    fieldLabel: "Content selector",
    id: "source-field-guide-content-selector",
    text: "CSS selector for the main patch note content on the detail page.",
  },
  contentFormat: {
    fieldLabel: "Content format",
    id: "source-field-guide-content-format",
    text: "Choose how extracted content should be normalized before storage.",
  },
  structureMode: {
    fieldLabel: "Structure mode",
    id: "source-field-guide-structure-mode",
    text: "Optional parsing hint for patch notes with consistent heading or nested list structures.",
  },
  includeTitleRegex: {
    fieldLabel: "Include title regex",
    id: "source-field-guide-include-title-regex",
    text: "Only ingest entries whose titles match this pattern.",
  },
  excludeTitleRegex: {
    fieldLabel: "Exclude title regex",
    id: "source-field-guide-exclude-title-regex",
    text: "Skip entries whose titles match this pattern.",
  },
  publishedAtRegex: {
    fieldLabel: "Published regex",
    id: "source-field-guide-published-regex",
    text: "Optional regex for extracting a date value when the selected content contains extra text.",
  },
  versionRegex: {
    fieldLabel: "Version regex",
    id: "source-field-guide-version-regex",
    text: "Optional regex for pulling a patch version from the title or content.",
  },
  region: {
    fieldLabel: "Region",
    id: "source-field-guide-region",
    text: "Optional source region label such as global, NA, EU, or KR.",
  },
  configJson: {
    fieldLabel: "Config JSON",
    id: "source-field-guide-config-json",
    text: "JSON configuration for non-HTML sources. Include the endpoint shape and any parser-specific settings.",
  },
} as const;

export const SOURCE_FIELD_GUIDE_GROUPS = [
  {
    title: "Basics",
    fields: ["name", "key", "baseUrl", "type", "isEnabled"] as const,
  },
  {
    title: "HTML source fields",
    fields: [
      "listPath",
      "entrySelector",
      "titleSelector",
      "linkSelector",
      "publishedAtSelector",
      "publishedAtAttribute",
      "contentSelector",
      "contentFormat",
      "structureMode",
      "includeTitleRegex",
      "excludeTitleRegex",
      "publishedAtRegex",
      "versionRegex",
      "region",
    ] as const,
  },
  {
    title: "API or RSS config",
    fields: ["configJson"] as const,
  },
] as const;

export const SOURCE_FIELD_GUIDE_SECTIONS = SOURCE_FIELD_GUIDE_GROUPS.map((group) => ({
  entries: group.fields.map((fieldKey) => SOURCE_FIELD_GUIDE[fieldKey]),
  title: group.title,
}));
