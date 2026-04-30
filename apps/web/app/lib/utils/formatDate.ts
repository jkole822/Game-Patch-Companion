const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type FormatDateOptions = {
  invalidValueFallback?: string | null;
  missingValueFallback?: string | null;
};

export const formatDate = (
  value: string | Date | null | undefined,
  options: FormatDateOptions = {},
) => {
  const { invalidValueFallback = null, missingValueFallback = null } = options;

  if (!value) {
    return missingValueFallback;
  }

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return invalidValueFallback;
  }

  return DATE_FORMATTER.format(timestamp);
};
