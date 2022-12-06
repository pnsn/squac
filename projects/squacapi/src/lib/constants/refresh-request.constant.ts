import { HttpContextToken } from "@angular/common/http";

export const REFRESH_REQUEST = new HttpContextToken<boolean>(() => false);
