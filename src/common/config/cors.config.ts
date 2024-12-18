import { allowedDomainConfig } from './allowed-domain.config';

export const corsConfig = {
  origin: (origin, callback) => {
    if (allowedDomainConfig.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
