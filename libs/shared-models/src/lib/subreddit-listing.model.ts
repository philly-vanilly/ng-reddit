import { Listing } from './listing-response.model';
import { Post } from '@libs/shared-models/src';

export interface MediaEmbed {
  content: string;
  width: number;
  scrolling: boolean;
  height: number;
}

export interface Oembed {
  provider_url: string;
  description: string;
  title: string;
  type: string;
  thumbnail_width: number;
  height: number;
  width: number;
  html: string;
  version: string;
  provider_name: string;
  thumbnail_url: string;
  thumbnail_height: number;
}

export interface SecureMedia {
  oembed: Oembed;
  type: string;
}

export interface SecureMediaEmbed {
  content: string;
  width: number;
  scrolling: boolean;
  media_domain_url: string;
  height: number;
}

export interface Gildings {
  gid_1: number;
  gid_2: number;
  gid_3: number;
}

export interface Source {
  url: string;
  width: number;
  height: number;
}

export interface Gif {
  source: Source;
  resolutions: Resolution[];
}

export interface Mp4 {
  source: Source;
  resolutions: Resolution[];
}

export interface Nsfw {
  source: Source;
  resolutions: Resolution[];
}

export interface Variants {
  obfuscated: Obfuscated;
  gif: Gif;
  mp4: Mp4;
  nsfw: Nsfw;
}

export interface Resolution {
  url: string;
  width: number;
  height: number;
}

export interface Obfuscated {
  source: Source;
  resolutions: Resolution[];
}

export interface RedditVideoPreview {
  fallback_url: string;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
}

export interface Preview {
  images: Image[];
  reddit_video_preview: RedditVideoPreview;
  enabled: boolean;
}

export interface Image {
  source: Source;
  resolutions: Resolution[];
  variants: Variants;
  id: string;
}

export interface MediaEmbed {
  content: string;
  width: number;
  scrolling: boolean;
  height: number;
}

export interface SecureMediaEmbed {
  content: string;
  width: number;
  scrolling: boolean;
  media_domain_url: string;
  height: number;
}

export interface Gildings {
  gid_1: number;
  gid_2: number;
  gid_3: number;
}

export interface Source {
  url: string;
  width: number;
  height: number;
}

export interface Resolution {
  url: string;
  width: number;
  height: number;
}

export interface Variants {
  obfuscated: Obfuscated;
  gif: Gif;
  mp4: Mp4;
  nsfw: Nsfw;
}

export interface Image {
  source: Source;
  resolutions: Resolution[];
  variants: Variants;
  id: string;
}

export interface Preview {
  images: Image[];
  enabled: boolean;
}

export interface SubredditListingModel extends Listing {
  kind: 't3';
  data: Post;
}
