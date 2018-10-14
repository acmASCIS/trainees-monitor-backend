import dotenv from 'dotenv';

// Loading ENV file
switch (process.env.ENV) {
  case 'production':
    dotenv.config({ path: '../.env.prod' });
    break;
  case 'staging':
    dotenv.config({ path: '../.env.staging' });
    break;
  default:
    dotenv.config({ path: '../.env.dev' });
}
