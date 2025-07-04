export const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    "<strong style='background-color: yellow; color:black;'>$1</strong>"
  );
};
