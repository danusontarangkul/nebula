const ZONE_SUFFIX: RegExp = /Z$|[+-]\d{2}:\d{2}$/;

export const toUtcDate = (raw: string): Date | null => {
  const trimmed: string = raw.trim();
  const hasZone: boolean = ZONE_SUFFIX.test(trimmed);
  const iso: string = hasZone ? trimmed : `${trimmed.replace(" ", "T")}Z`;
  const date: Date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};
