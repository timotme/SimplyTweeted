/**
 * IMPORTANT: To use Twitter Communities, you need to:
 * 
 * 1. Be a member of the community you want to post to
 * 2. Have the correct permissions to post in that community
 * 3. Get the actual Twitter Community ID from the community URL or API
 * 
 * To find a Twitter Community ID:
 * - Go to the community page on Twitter/X
 * - The ID is in the URL: https://twitter.com/i/communities/[COMMUNITY_ID]
 * - Or use the Twitter API: GET /2/tweets/search/recent?query=conversation_id:[tweet_id]
 * 
 * Replace the example IDs below with actual community IDs.
 */

export interface CommunityMapping {
  [communityName: string]: string; 
}

export const COMMUNITY_MAPPINGS: CommunityMapping = {
  "Build in Public": "1493446837214187523",
  "Software Engineering": "1699807431709041070"
};

/**
 * Get Twitter Community ID from community name
 * @param communityName - The human-readable community name
 * @returns Twitter Community ID if found, null if not found or empty
 */
export function getCommunityId(communityName: string): string | null {
  if (!communityName || communityName.trim() === '') {
    return null;
  }
  
  return COMMUNITY_MAPPINGS[communityName] || null;
}

/**
 * Check if a community name has a valid mapping
 * @param communityName - The human-readable community name
 * @returns true if the community has a mapping, false otherwise
 */
export function hasCommunityMapping(communityName: string): boolean {
  return getCommunityId(communityName) !== null;
}

/**
 * Get all available community names
 * @returns Array of all configured community names
 */
export function getAvailableCommunities(): string[] {
  return Object.keys(COMMUNITY_MAPPINGS);
} 