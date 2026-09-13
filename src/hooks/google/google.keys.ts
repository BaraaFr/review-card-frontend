export const googleKeys = {
  all: [
    "google",
  ] as const,

  reputation: (
    storeId: string
  ) =>
    [
      ...googleKeys.all,
      "reputation",
      storeId,
    ] as const,
};