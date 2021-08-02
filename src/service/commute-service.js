import * as CommuteRepo from '../repo/commute-repo';

import formatStringToLabelId from '../utils/format-string-to-label-id';
import {
  getDistinctKeys,
  updateMaps,
  initMaps,
  findShortestPathBetweenAllNodes,
  getDealsUsingPaths,
  getTotalFromCommutes
} from '../utils/graph-utils';

import { formatDealsToAddMinutes } from '../utils/time-utils';

export const getDistinctLocations = () => {
  const { deals } = CommuteRepo.getAllCommutes();
  return formatDistinctLocations(getDistinctKeys(deals));
};

export const getShortestPathBetweenTwoNodes = (
  startNode,
  endNode,
  edgeWeightPropertyName
) => {
  const { deals, currency } = CommuteRepo.getAllCommutes();
  const formattedDeals = formatDealsToAddMinutes(deals);
  const distinctKeySet = getDistinctKeys(formattedDeals);
  const { graphMap, pathMap, routeMap } = initMaps(distinctKeySet);

  updateMaps(
    formattedDeals,
    graphMap,
    pathMap,
    routeMap,
    edgeWeightPropertyName
  );

  findShortestPathBetweenAllNodes(distinctKeySet, graphMap, routeMap);
  let commutes = [];
  commutes = getDealsUsingPaths(pathMap, routeMap, startNode, endNode, []);

  return {
    total: getTotalFromCommutes(commutes),
    currency,
    commutes
  };
};

const formatDistinctLocations = distinctLocations => {
  return distinctLocations.map(location => formatStringToLabelId(location));
};
