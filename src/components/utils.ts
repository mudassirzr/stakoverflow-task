// Converts EPOCH time stamp to local time
export const getLocaleStringFromEpoch = (time: number) => {
  return new Date(new Date(0).setUTCSeconds(time)).toLocaleDateString();
};
