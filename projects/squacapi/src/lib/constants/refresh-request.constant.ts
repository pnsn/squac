import { HttpContextToken } from "@angular/common/http";

/** Token for refresh requests */
export const REFRESH_REQUEST = new HttpContextToken<boolean>(() => false);
