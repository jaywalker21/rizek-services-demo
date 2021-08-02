export const formatDealsToAddMinutes = deals => {
  return deals.map(deal => ({
    ...deal,
    durationInMinutes:
      parseInt(deal.duration.h, 10) * 60 + parseInt(deal.duration.m, 10)
  }));
};

export const convertDurationInMinutesToDurationObject = deal => {
  const { durationInMinutes } = deal;
  const hours = ('0' + Math.floor(durationInMinutes / 60)).slice(-2);
  const minutes = ('0' + (durationInMinutes % 60)).slice(-2);
  return {
    ...deal,
    duration: {
      h: hours,
      m: minutes
    }
  };
};
