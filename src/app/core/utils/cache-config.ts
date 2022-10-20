import { LocalStorageTypes } from "@core/services/local-storage.service";

export const CachableRoutePatterns = {
  "/dashboard/dashboards/": LocalStorageTypes.SESSION,
  "/dashboard/dashboards/:id/": LocalStorageTypes.SESSION,
  "/measurement/metrics/": LocalStorageTypes.SESSION,
  "/measurement/metrics/:id/": LocalStorageTypes.SESSION,
  "/measurement/measurements/": LocalStorageTypes.SESSION,
  "/organization/organizations": LocalStorageTypes.SESSION,
  "/nslc/groups/": LocalStorageTypes.SESSION,
  "/nslc/groups/:id/": LocalStorageTypes.SESSION,
};
