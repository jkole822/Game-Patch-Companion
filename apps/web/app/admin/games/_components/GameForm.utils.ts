export const getString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

export const buildGamePayload = (formData: FormData) => {
  const payload = {
    key: getString(formData, "key"),
    title: getString(formData, "title"),
  };

  if (!payload.key || !payload.title) {
    return {
      error: "Please check the game fields and try again.",
      payload: null,
    } as const;
  }

  return {
    error: null,
    payload,
  } as const;
};
