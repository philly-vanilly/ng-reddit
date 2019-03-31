import { Listing } from './listing-response.model';

export interface SubredditInAccount {
  default_set: boolean;
  user_is_contributor: boolean;
  banner_img: string;
  user_is_banned: boolean;
  free_form_reports: boolean;
  community_icon: string;
  show_media: boolean;
  description: string;
  user_is_muted: boolean;
  display_name: string;
  header_img?: any;
  title: string;
  over_18: boolean;
  icon_size: number[];
  primary_color: string;
  icon_img: string;
  icon_color: string;
  header_size?: any;
  subscribers: number;
  is_default_icon: boolean;
  link_flair_position: string;
  display_name_prefixed: string;
  key_color: string;
  name: string;
  is_default_banner: boolean;
  url: string;
  banner_size?: any;
  user_is_moderator: boolean;
  public_description: string;
  link_flair_enabled: boolean;
  subreddit_type: string;
  user_is_subscriber: boolean;
}

export interface AccountListingChild {
  is_employee: boolean;
  icon_img: string;
  pref_show_snoovatar: boolean;
  name: string;
  is_friend: boolean;
  created: number;
  has_subscribed: boolean;
  hide_from_robots: boolean;
  created_utc: number;
  link_karma: number;
  comment_karma: number;
  is_gold: boolean;
  is_mod: boolean;
  verified: boolean;
  subreddit: SubredditInAccount;
  has_verified_email: boolean;
  id: string;
  notification_level?: any;
  user_flair_background_color?: any;
  wls?: number;
  banner_img: string;
  user_sr_theme_enabled?: boolean;
  user_flair_text?: any;
  submit_text_html: string;
  user_flair_css_class?: any;
  user_flair_template_id?: any;
  user_is_banned?: boolean;
  free_form_reports?: boolean;
  community_icon: string;
  banner_background_image: string;
  header_title?: any;
  wiki_enabled?: any;
  over18?: boolean;
  show_media?: boolean;
  banner_background_color: string;
  description: string;
  user_is_muted?: boolean;
  user_flair_type: string;
  user_can_flair_in_sr?: any;
  display_name: string;
  header_img: string;
  description_html: string;
  title: string;
  collapse_deleted_comments?: boolean;
  user_has_favorited?: boolean;
  emojis_custom_size?: any;
  emojis_enabled?: boolean;
  public_description_html: string;
  can_assign_user_flair?: boolean;
  allow_videos?: boolean;
  spoilers_enabled?: boolean;
  icon_size: number[];
  primary_color: string;
  user_is_contributor?: boolean;
  all_original_content?: boolean;
  suggested_comment_sort: string;
  active_user_count?: any;
  original_content_tag_enabled?: boolean;
  display_name_prefixed: string;
  can_assign_link_flair?: boolean;
  submit_text: string;
  allow_videogifs?: boolean;
  user_flair_text_color?: any;
  accounts_active?: any;
  public_traffic?: boolean;
  header_size: number[];
  subscribers?: number;
  user_flair_position: string;
  submit_text_label?: any;
  key_color: string;
  link_flair_position: string;
  user_flair_richtext: any[];
  user_sr_flair_enabled?: any;
  lang: string;
  has_menu_widget?: boolean;
  is_enrolled_in_new_modmail?: any;
  whitelist_status: string;
  user_flair_enabled_in_sr?: boolean;
  url: string;
  quarantine?: boolean;
  hide_ads?: boolean;
  banner_size: number[];
  user_is_moderator?: boolean;
  submit_link_label: string;
  allow_discovery?: boolean;
  accounts_active_is_fuzzed?: boolean;
  advertiser_category: string;
  public_description: string;
  link_flair_enabled?: boolean;
  allow_images?: boolean;
  show_media_preview?: boolean;
  comment_score_hide_mins?: number;
  subreddit_type: string;
  submission_type: string;
  user_is_subscriber?: boolean;
}

export interface AccountListing extends Listing {
  kind: 't2';
  data: AccountListingChild;
}