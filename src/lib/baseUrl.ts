function getBaseUrl(): string {
  // In production
  if (process.env.NODE_ENV === "production") {
    // Try Vercel's environment variable first
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // Fallback to NEXT_PUBLIC_BASE_URL
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // If neither is set, we need to set one of them in Vercel
    console.warn(
      "No base URL configured for production. Please set VERCEL_PROJECT_PRODUCTION_URL or NEXT_PUBLIC_BASE_URL in your Vercel environment variables."
    );
    return "https://fermi.vercel.app"; // Replace with your actual domain
  }

  // In development
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return "http://localhost:3000";
}

const baseUrl = getBaseUrl();

export default baseUrl;
