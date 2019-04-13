export type SortBy = 'hot' | 'top' | 'new' | 'random' | 'best' | 'rising' | 'controversial';

// t1_	Comment
// t2_	Account
// t3_	Link
// t4_	Message
// t5_	Subreddit
// t6_	Award
export type ListingKind = 't1' | 't2' | 't3' | 't4' | 't5' | 't6';

export interface Listing {
  kind: ListingKind;
  data: any;
}

export interface ListingData {
  modhash?: string;
  dist: number;
  children: Listing[];
  after: string;
  before: string;
}

export interface ListingResponseModel {
  kind: 'Listing';
  data: ListingData;
}
