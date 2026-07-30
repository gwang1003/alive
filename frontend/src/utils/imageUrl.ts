export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  return `${import.meta.env.VITE_API_URL || '/api'}${path}`;
};
