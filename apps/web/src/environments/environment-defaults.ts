export const commonGlobalConstants = {
  appName: 'Reddit Image Browser Redux',
  corsProxy: 'https://cors-anywhere.herokuapp.com/'
};

export const redditAuthConfigForLocalhost = {
  redirectURI: 'http://localhost:4200',
  clientID: 'LIAwXTh9LNpz6A'
};

export const redditAuthConfigForGithub = {
  redirectURI: 'https://philly-vanilly.github.io/ng-reddit',
  clientID: 'MSpMOnO6gertnA'
};

export const redditEndpoints = {
  redditAuthURI: 'https://www.reddit.com/api/v1/authorize',
  redditAppAuthURI: 'https://ssl.reddit.com/api/v1/access_token'
};
