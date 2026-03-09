/**
 * Converts a GitHub profile URL to a direct avatar image URL.
 * Example: https://github.com/OttomanDeveloper -> https://github.com/OttomanDeveloper.png
 */
export function getGithubAvatarUrl(profileUrl: string | null | undefined): string | null {
  if (!profileUrl) return null;
  
  // If it's already an image URL or not a github link, return as is
  if (profileUrl.includes('.png') || profileUrl.includes('.jpg') || profileUrl.includes('.webp') || !profileUrl.includes('github.com')) {
    return profileUrl;
  }

  // Clean the URL and append .png
  try {
    const url = new URL(profileUrl);
    if (url.hostname === 'github.com') {
      const username = url.pathname.split('/')[1];
      if (username) {
        return `https://github.com/${username}.png`;
      }
    }
  } catch (e) {
    // If URL parsing fails, try simple regex
    const match = profileUrl.match(/github\.com\/([^\/]+)/);
    if (match && match[1]) {
      return `https://github.com/${match[1]}.png`;
    }
  }

  return profileUrl;
}
