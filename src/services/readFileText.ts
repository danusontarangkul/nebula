export const readFileText = async (file: File): Promise<string> => {
  try {
    return await file.text();
  } catch {
    throw new Error(`Failed to read ${file.name}`);
  }
};
