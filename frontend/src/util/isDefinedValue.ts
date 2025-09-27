export const isDefined = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value !== "";
};
