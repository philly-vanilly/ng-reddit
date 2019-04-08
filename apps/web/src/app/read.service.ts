import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListingResponseModel } from './models/listing-response.model';
import { AccountListingModel } from './models/account-listing.model';
import { LinkListingModel } from './models/link-listing.model';
import { SubredditListingModel } from './models/subreddit-listing.model';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';
import { PostModel } from '@libs/shared-models/src';


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

  getSubreddit(subName: string): Observable<PostModel[]> {
    const reqUrl = `https://oauth.reddit.com/r/${subName}/hot`;
    return this.http.get<ListingResponseModel>(reqUrl).pipe(
      map((res: ListingResponseModel) => (res.data.children as SubredditListingModel[])
        .map((listing: SubredditListingModel) => listing.data))
    );
  }
}
