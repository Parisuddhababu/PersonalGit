export const TextTruncate = (str: string, limit: number): string => {
  return str.length > limit ? `${str.substring(0, limit)}...` : str;
};

export const textReplacePWithSpan = (html) => {
  return html.replace(/<p>|<\/p>/g, "<span>");
};
