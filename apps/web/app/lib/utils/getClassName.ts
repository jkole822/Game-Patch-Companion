export const getClassName = (baseClassName: string, className?: string): string => {
  if (!className) {
    return baseClassName;
  }

  return `${baseClassName} ${className}`;
};
