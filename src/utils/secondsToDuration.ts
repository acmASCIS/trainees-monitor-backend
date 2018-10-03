import moment from 'moment';

// Changes Unix Seconds to Duration object
export function secondsToDuration(seconds: number): moment.Duration {
  const currentTime = moment();
  const lastSeenTime = moment.unix(seconds);
  return moment.duration(currentTime.diff(lastSeenTime));
}
