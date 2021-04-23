import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { ArchiveAdapter } from '../models/archive';

@Injectable({
  providedIn: 'root'
})
export class ArchivesService {

  constructor(
    private squacApi: SquacApiService,
    private archiveAdapter : ArchiveAdapter
  ) { }

  "day-archives"
  "hour-archives"
  "month-archives"
  "week-archives"

  
  
}
