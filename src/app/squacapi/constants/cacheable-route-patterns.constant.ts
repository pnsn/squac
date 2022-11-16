import { LocalStorageTypes } from "@core/services/local-storage.service";
// FIXME: shouldn't be importing from core
export const CACHEABLE_ROUTE_PATTERNS = {
  "/dashboard/dashboards/": LocalStorageTypes.SESSION,
  "/dashboard/dashboards/:id/": LocalStorageTypes.SESSION,
  "/measurement/metrics/": LocalStorageTypes.SESSION,
  "/measurement/metrics/:id/": LocalStorageTypes.SESSION,
  "/measurement/measurements/": LocalStorageTypes.SESSION,
  "/measurement/aggregated/": LocalStorageTypes.SESSION,
  "/measurement/day-archives/": LocalStorageTypes.SESSION,
  "/measurement/hour-archives/": LocalStorageTypes.SESSION,
  "/measurement/week-archives/": LocalStorageTypes.SESSION,
  "/measurement/month-archives/": LocalStorageTypes.SESSION,
  "/organization/organizations": LocalStorageTypes.SESSION,
  "/nslc/groups/": LocalStorageTypes.SESSION,
  "/nslc/groups/:id/": LocalStorageTypes.SESSION,
};
