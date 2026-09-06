export type DateRangeKey = "today" | "7d" | "30d" | "90d" | "6m" | "12m" | "custom";

export function resolveDateRange(key: string | null | undefined, customFrom?: string | null, customTo?: string | null) {
  const to = new Date();
  const from = new Date();

  switch (key) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "7d":
      from.setDate(from.getDate() - 7);
      break;
    case "90d":
      from.setDate(from.getDate() - 90);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "12m":
      from.setMonth(from.getMonth() - 12);
      break;
    case "custom":
      if (customFrom) return { from: new Date(customFrom), to: customTo ? new Date(customTo) : to };
      from.setDate(from.getDate() - 30);
      break;
    case "30d":
    default:
      from.setDate(from.getDate() - 30);
      break;
  }

  return { from, to };
}
