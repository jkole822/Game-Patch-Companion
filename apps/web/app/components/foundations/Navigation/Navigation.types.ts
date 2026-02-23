type Link = { label?: string; href?: string };

export interface NavigationProps {
  cta?: Link;
  links?: Link[];
}
