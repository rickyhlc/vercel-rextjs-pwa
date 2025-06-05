"use server";

export const test = async (options) => {
  try {
    const res = await fetch("https://rickyzero-api.vercel.app/home");
    return res.json();
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}