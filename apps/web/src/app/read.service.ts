import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListingKind, ListingResponseModel, SortBy } from '@libs/shared-models/src/lib/listing-response.model';
import { AccountListingModel } from '@libs/shared-models/src/lib/account-listing.model';
import { LinkListingModel } from '@libs/shared-models/src/lib/link-listing.model';
import { SubredditListingModel } from '@libs/shared-models/src/lib/subreddit-listing.model';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';
import { Post } from '@libs/shared-models/src';
import { Sub } from '@web/src/app/sub/sub.store';


@Injectable()
export class ReadService {
  access_token: string;
  constructor(
    private http: HttpClient,
  ) {}

  getAutocomplete(term: string): Observable<HeaderAutocompleteOptions[]> {
    const reqUrl = `https://oauth.reddit.com/api/subreddit_autocomplete_v2?include_over_18=true&include_profiles=true&query=${term}`;
    return this.http.get<ListingResponseModel>(reqUrl).pipe(
      map((res: ListingResponseModel) =>
        res.data.children.map((listing: AccountListingModel | LinkListingModel) => {
            if (listing.kind === 't2') {
              const accountData = (listing as AccountListingModel).data;
              return {
                value: accountData.name,
                isUser: true
              } as HeaderAutocompleteOptions;
            } else if (listing.kind === 't5') {
              const subredditData = (listing as LinkListingModel).data;
              return {
                value: subredditData.url,
                isUser: false
              }
            }
          })
      )
    );
  }

  getInitialListing(rootPath: string, listingId: string, sortBy: SortBy): Observable<ListingResponseModel> {

    const reqUrl = `https://oauth.reddit.com/${rootPath}/${listingId}/${sortBy}`;
    return this.fetchListing(reqUrl);
  }

  getSubsequentListing(after: string, count: number): Observable<ListingResponseModel>  {
    const reqUrl = `https://oauth.reddit.com?after=${after}&count=${count}`;
    return this.fetchListing(reqUrl);
  }

  private fetchListing(reqUrl: string): Observable<ListingResponseModel> {
    return this.http.get<ListingResponseModel>(reqUrl);
  }
}
