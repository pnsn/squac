import { Injectable } from '@angular/core';
import { Adapter } from '@core/models/adapter';

export class Trigger {
  constructor(
    public id: number,
    public monitorId: number,
    public bandInclusive: boolean,
    public level: number,
    public owner: number,
    public min?: number,
    public max?: number
  ) {
  }
  static get modelName() {
    return 'Trigger';
  }
}

export interface ApiGetTrigger {
  id: number;
  url: string;
  monitor: number;
  minval: number;
  maxval: number;
  band_inclusive: boolean;
  level: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ApiPostTrigger {
  monitor: number;
  minval: number;
  maxval: number;
  band_inclusive: boolean;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class TriggerAdapter implements Adapter<Trigger> {
  adaptFromApi(item: ApiGetTrigger): Trigger {
    return new Trigger(
      item.id,
      item.monitor,
      item.band_inclusive,
      item.level,
      +item.user_id,
      item.minval,
      item.maxval
    );
  }

  adaptToApi(item: Trigger): any {
    return {
      monitor: item.monitorId,
      band_inclusive: item.bandInclusive,
      level: item.level,
      minval: item.min,
      maxval: item.max
    };
  }
}
