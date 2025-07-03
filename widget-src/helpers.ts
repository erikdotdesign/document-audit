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
  const sentence = str.replace(/([A-Z])/g, ' $1');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
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

export const tallyObjectValues = (obj: object): number => {
  return Object.values(obj).reduce((sum, value) => sum + value, 0);
};

export const tallyValue = (value: object | number): number => {
  if (typeof value === "object") {
    return tallyObjectValues(value);
  } else {
    return value;
  }
};

export const hexToRGBA = (hex: string, alpha = 1): RGBA => {
  // Remove leading #
  hex = hex.replace(/^#/, '');

  // Expand 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return { r, g, b, a: alpha };
}