import axios from 'axios';
import axiosRetry from 'axios-retry';

// Setting up retry in case of 429 response (Too many requests)
axiosRetry(axios, {
  retries: 10,
  retryCondition: error => {
    return error.response ? error.response.status === 429 : false;
  },
  retryDelay: count => count * 1000
});
