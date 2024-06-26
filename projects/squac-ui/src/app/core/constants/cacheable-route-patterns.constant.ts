import { LocalStorageTypes } from "../services/local-storage.service";

/** route patterns that can be cached */
export const CACHEABLE_ROUTE_PATTERNS: Record<string, any> = {
  "/dashboard/dashboards/": LocalStorageTypes.SESSION,
  // "/dashboard/dashboards/:id/": LocalStorageTypes.SESSION,
  "/measurement/metrics/": LocalStorageTypes.SESSION,
  "/measurement/metrics/:id/": LocalStorageTypes.SESSION,
  "/organization/organizations/": LocalStorageTypes.SESSION,
  "/nslc/groups/": LocalStorageTypes.SESSION,
  "/nslc/groups/:id/": LocalStorageTypes.SESSION,
};
