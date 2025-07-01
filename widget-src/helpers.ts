export const formatNumber = (n: number | string): string => {
  if (typeof n === 'number') {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return n;
  }
};

export const camelCaseToTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase());
};

export const camelCaseToSentence = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, char => char.toUpperCase());
};

export const camelCaseToSentenceLower = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase();
};

export const typedKeys = <T extends object>(obj: T): Array<keyof T> => {
  return Object.keys(obj) as Array<keyof T>;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
};

export const tallyObjectValues = (obj: object) => {
  return Object.values(obj).reduce((sum, value) => sum + value, 0);
};