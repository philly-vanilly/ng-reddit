import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListingResponse } from './models/listing-response.model';
import { AccountListing } from './models/account-listing.model';
import { LinkListing } from './models/link-listing.model';
import { SubPost, SubredditListing } from './models/subreddit-listing.model';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';


@Injectable()
export class ReadService {
  access_token: string;
  constructor(
    private http: HttpClient,
  ) {}

  getAutocomplete(term: string): Observable<HeaderAutocompleteOptions[]> {
    const reqUrl = `https://oauth.reddit.com/api/subreddit_autocomplete_v2?include_over_18=true&include_profiles=true&query=${term}`;
    return this.http.get<ListingResponse>(reqUrl).pipe(
      map((res: ListingResponse) =>
        res.data.children.map((listing: AccountListing | LinkListing) => {
            if (listing.kind === 't2') {
              const accountData = (listing as AccountListing).data;
              return {
                value: accountData.name,
                isUser: true
              } as HeaderAutocompleteOptions;
            } else if (listing.kind === 't5') {
              const subredditData = (listing as LinkListing).data;
              return {
                value: subredditData.url,
                isUser: false
              }
            }
          })
      )
    );
  }

  getSubreddit(subName: string): Observable<SubPost[]> {
    const reqUrl = `https://oauth.reddit.com${subName}/hot`;
    return this.http.get<ListingResponse>(reqUrl).pipe(
      map((res: ListingResponse) => (res.data.children as SubredditListing[])
        .map((listing: SubredditListing) => listing.data))
    );
  }
}
