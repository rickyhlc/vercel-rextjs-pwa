const GOOGLE_CLIENT_ID = "801379241920-f080u9pl73l38v2julgpqur2o910do69.apps.googleusercontent.com"; // Replace with your Google Client ID

export async function checkSignInStatus() {
  try {
    const token = localStorage.getItem("googleAuthToken");
    if (!token) return false;

    const response = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);
    if (response.ok) {
      const data = await response.json();
      return data && data.aud === GOOGLE_CLIENT_ID; // Replace with your Google Client ID
    }
    return false;
  } catch (error) {
    console.error("Error checking sign-in status:", error);
    return false;
  }
}

export function signInWithGoogle() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth&response_type=id_token&scope=openid email profile`;
  window.location.href = authUrl;
}
