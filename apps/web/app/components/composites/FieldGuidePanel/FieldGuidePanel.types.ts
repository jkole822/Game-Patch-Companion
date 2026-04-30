export interface FieldGuideEntry {
  fieldLabel: string;
  id: string;
  text: string;
}

export interface FieldGuideSection {
  entries: FieldGuideEntry[];
  title: string;
}

export interface FieldGuidePanelProps {
  description?: string;
  sections: FieldGuideSection[];
  title?: string;
}
