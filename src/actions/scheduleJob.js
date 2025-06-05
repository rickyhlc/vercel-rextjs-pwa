export const test = async (options) => {
  try {
    return await fetch("https://rickyzero-api.vercel.app/home");
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}