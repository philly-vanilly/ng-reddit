import { Listing } from './listing-response.model';

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

export interface SubPost {
  crosspost_parent_list: SubPost[];
  crosspost_parent: string;
  approved_at_utc?: any;
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  mod_reason_title?: any;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: any[];
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: string;
  downs: number;
  thumbnail_height?: number;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  author_flair_background_color: string;
  subreddit_type: string;
  ups: number;
  domain: string;
  media_embed: MediaEmbed;
  thumbnail_width?: number;
  author_flair_template_id: string;
  is_original_content: boolean;
  user_reports: any[];
  secure_media?: SecureMedia;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category?: any;
  secure_media_embed: SecureMediaEmbed;
  link_flair_text: string;
  can_mod_post: boolean;
  score: number;
  approved_by?: any;
  thumbnail: string;
  edited: boolean;
  author_flair_css_class: string;
  author_flair_richtext: any[];
  gildings: Gildings;
  post_hint: string;
  content_categories?: any;
  is_self: boolean;
  mod_note?: any;
  created: number;
  link_flair_type: string;
  wls: number;
  banned_by?: any;
  author_flair_type: string;
  contest_mode: boolean;
  selftext_html: string;
  likes?: any;
  suggested_sort?: any;
  banned_at_utc?: any;
  view_count?: any;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview: Preview;
  media_only: boolean;
  link_flair_template_id: string;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: string;
  visited: boolean;
  num_reports?: any;
  distinguished: string;
  subreddit_id: string;
  mod_reason_by?: any;
  removal_reason?: any;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  report_reasons?: any;
  author: string;
  num_crossposts: number;
  num_comments: number;
  send_replies: boolean;
  whitelist_status: string;
  mod_reports: any[];
  author_patreon_flair: boolean;
  author_flair_text_color: string;
  permalink: string;
  parent_whitelist_status: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  media?: any;
  is_video: boolean;
  author_cakeday?: boolean;
}

export interface SubredditListing extends Listing {
  kind: 't3';
  data: SubPost;
}
