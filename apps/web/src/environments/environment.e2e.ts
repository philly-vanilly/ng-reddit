import { commonGlobalConstants, redditAuthConfigForGithub, redditEndpoints } from './environment-defaults';

export const environment = {
  ...commonGlobalConstants,
  ...redditAuthConfigForGithub,
  ...redditEndpoints,
  name: 'e2e',
  production: true,
  useAnimations: true,
  hmr: false
};
