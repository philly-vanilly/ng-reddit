import { commonGlobalConstants, redditAuthConfigForGithub, redditEndpoints } from './environment-defaults';

export const environment = {
  ...commonGlobalConstants,
  ...redditAuthConfigForGithub,
  ...redditEndpoints,
  production: true,
  useAnimations: true,
  hmr: false
};
