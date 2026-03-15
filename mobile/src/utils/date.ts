export const isToday = (value?: string): boolean => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const isUpcoming = (value?: string): boolean => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endRange = new Date(startToday);
  endRange.setDate(endRange.getDate() + 7);
  return date > startToday && date <= endRange;
};

export const formatDateLabel = (value?: string): string => {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
