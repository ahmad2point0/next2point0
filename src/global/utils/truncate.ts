export function truncate(value: string, max = 80, suffix = "..."): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - suffix.length).trimEnd()}${suffix}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
