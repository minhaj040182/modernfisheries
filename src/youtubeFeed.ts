import { Video } from "./types";
import { OWN_VIDEOS, TOP_INNOVATION_IDEAS } from "./data";

export const MODERN_FISHERIES_CHANNEL_ID = "UChChDXzRMI9g1lgcTo5KA3A";

export const channels = [
  { id: MODERN_FISHERIES_CHANNEL_ID, creator: "Modern Fisheries", type: "own" as const }
];

export function getYouTubeApiKey(): string {
  return "";
}

export function isUsingLiveYouTubeApi(): boolean {
  return false;
}

export interface UserLocationInfo {
  countryCode: string;
  countryName: string;
  isIndia: boolean;
  isUS: boolean;
  detectedRegionName: string;
}

let cachedUserLocation: UserLocationInfo | null = null;

// Timezone-only detection avoids an automatic third-party geolocation request.
export async function detectUserLocation(): Promise<UserLocationInfo> {
  if (cachedUserLocation) return cachedUserLocation;

  let countryCode = "US";
  let countryName = "United States";

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (timezone.includes("Kolkata") || timezone.includes("Calcutta") || timezone.includes("India")) {
      countryCode = "IN";
      countryName = "India";
    }
  } catch {
    // Use the static default when timezone data is unavailable.
  }

  const isIndia = countryCode === "IN";
  const isUS = countryCode === "US" || countryCode === "CA";

  cachedUserLocation = {
    countryCode,
    countryName,
    isIndia,
    isUS,
    detectedRegionName: isIndia ? "India" : "North America / USA"
  };

  return cachedUserLocation;
}

export function getLocationQuerySuffix(userLoc?: UserLocationInfo | null): string {
  if (!userLoc) return "";
  if (userLoc.isIndia) return " India Hindi Indian aquaculture";
  if (userLoc.isUS) return " USA America English aquaculture";
  return ` ${userLoc.countryName} aquaculture`;
}

export function isModernFisheriesVideo(item: { title?: string; creator?: string; channelId?: string; type?: string }): boolean {
  if (item.type === "own" || item.channelId === MODERN_FISHERIES_CHANNEL_ID) return true;

  const title = (item.title || "").toLowerCase();
  const creator = (item.creator || "").toLowerCase();
  return title.includes("modern fisheries") || title.includes("modernfisheries") ||
    creator.includes("modern fisheries") || creator.includes("modernfisheries");
}

// Curated video data is always available and never blocks article rendering.
export async function fetchOwnChannelVideos(_forceRefresh = false): Promise<Video[]> {
  return [...OWN_VIDEOS];
}

export async function fetchTrendingTopicVideos(
  _forceRefresh = false,
  _searchQuery = "modern fish farming technology aquaponics biofloc ras innovations",
  _userLocOverride?: UserLocationInfo | null
): Promise<Video[]> {
  return [...TOP_INNOVATION_IDEAS];
}

export async function fetchChannelVideosWithFallback(): Promise<Video[]> {
  return fetchOwnChannelVideos();
}

export async function fetchYouTubeChannelVideos(): Promise<Video[]> {
  return [...OWN_VIDEOS, ...TOP_INNOVATION_IDEAS];
}
