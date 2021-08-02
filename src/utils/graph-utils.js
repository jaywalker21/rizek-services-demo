import { convertDurationInMinutesToDurationObject } from './time-utils';

const MAX_VALUE = Infinity;

export const getDistinctKeys = deals => {
  const distinctLocations = new Set();
  deals.map(({ departure, arrival }) => {
    distinctLocations.add(departure);
    distinctLocations.add(arrival);
  });
  return [...distinctLocations];
};

export const initMaps = distinctKeys => {
  const graphMap = {};
  const pathMap = {};
  const routeMap = {};
  for (let i = 0; i < distinctKeys.length; i++) {
    if (!graphMap[distinctKeys[i]]) {
      graphMap[distinctKeys[i]] = {};
    }
    if (!pathMap[distinctKeys[i]]) {
      pathMap[distinctKeys[i]] = {};
    }
    if (!routeMap[distinctKeys[i]]) {
      routeMap[distinctKeys[i]] = {};
    }
    for (let j = 0; j < distinctKeys.length; j++) {
      graphMap[distinctKeys[i]][distinctKeys[j]] = i === j ? 0 : MAX_VALUE;
      pathMap[distinctKeys[i]][distinctKeys[j]] = null;
    }
  }
  return { graphMap, pathMap, routeMap };
};

export const updateMaps = (
  deals,
  graphMapInstance,
  pathMapInstance,
  routeMapInstance,
  edgeCostPropertyName
) => {
  deals.map(deal => {
    const { arrival, departure } = deal;
    const edgeCost = deal[edgeCostPropertyName];
    if (edgeCost < graphMapInstance[departure][arrival]) {
      graphMapInstance[departure][arrival] = edgeCost;
      pathMapInstance[departure][arrival] = deal;
      routeMapInstance[departure][arrival] = [departure, arrival];
    }
  });
};

export const findShortestPathBetweenAllNodes = (
  distinctKeySet,
  graphMap,
  routeMap
) => {
  for (let k = 0; k < distinctKeySet.length; k++) {
    for (let j = 0; j < distinctKeySet.length; j++) {
      for (let i = 0; i < distinctKeySet.length; i++) {
        if (
          graphMap[distinctKeySet[i]][distinctKeySet[k]] +
            graphMap[distinctKeySet[k]][distinctKeySet[j]] <
          graphMap[distinctKeySet[i]][distinctKeySet[j]]
        ) {
          graphMap[distinctKeySet[i]][distinctKeySet[j]] =
            graphMap[distinctKeySet[i]][distinctKeySet[k]] +
            graphMap[distinctKeySet[k]][distinctKeySet[j]];
          if (!routeMap[distinctKeySet[i]]) {
            routeMap[distinctKeySet[i]] = {};
          }
          routeMap[distinctKeySet[i]][distinctKeySet[j]] = [
            distinctKeySet[i],
            distinctKeySet[k],
            distinctKeySet[j]
          ];
        }
      }
    }
  }
};

export const getDealsUsingPaths = (
  pathMap,
  routeMap,
  startNode,
  endNode,
  deals
) => {
  const route = routeMap[startNode][endNode];
  if (Array.isArray(route)) {
    for (let i = 0; i < route.length - 1; i++) {
      if (pathMap[route[i]][route[i + 1]]) {
        deals.push(pathMap[route[i]][route[i + 1]]);
      } else {
        deals.concat(
          getDealsUsingPaths(pathMap, routeMap, route[i], route[i + 1], deals)
        );
      }
    }
  } else {
    throw new Error('No Deal avalable for this path');
  }
  return deals;
};

export const getTotalFromCommutes = commutes => {
  const total = commutes.reduce(
    (acc, curr) => {
      return {
        cost: acc.cost + curr.cost,
        durationInMinutes: acc.durationInMinutes + curr.durationInMinutes
      };
    },
    {
      cost: 0,
      durationInMinutes: 0
    }
  );
  return convertDurationInMinutesToDurationObject(total);
};
