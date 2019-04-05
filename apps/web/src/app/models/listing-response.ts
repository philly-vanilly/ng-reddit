export interface Listing {
// t1_	Comment
// t2_	Account
// t3_	Link
// t4_	Message
// t5_	Subreddit
// t6_	Award
  kind: 't1' | 't2' | 't3' | 't4' | 't5' | 't6' ;
  data: any;
}

export interface ListingData {
  modhash?: string;
  dist: number;
  children: Listing[];
  after: string;
  before: string;
}

export interface ListingResponse {
  kind: 'Listing';
  data: ListingData;
}
