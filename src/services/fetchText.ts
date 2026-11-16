export const fetchText = async (fileName: string): Promise<string> => {
  const response: Response = await fetch(`${import.meta.env.BASE_URL}${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${fileName} (${response.status})`);
  }
  return response.text();
};
