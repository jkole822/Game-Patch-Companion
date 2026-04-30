const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Awaiting published date";
  }

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return "Date unavailable";
  }

  return DATE_FORMATTER.format(timestamp);
};
