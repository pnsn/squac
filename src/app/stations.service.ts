import { throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpErrorResponse} from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';

@Injectable()
export class StationsService {
  
  constructor (
    private http: HttpClient
  ) {}
   
   // Parse text file and map to station objects
   private mapStations(response: any): Object{
     console.log(response)
     return response;
   }

   // Fetch requested stations
  getStations() : Observable <any>{
    
    var stationsUrl = 'https://squac.pnsn.org/api/v1/nslc/stations';

    return this.http.get(stationsUrl)
      .pipe(
        map(this.mapStations),
        catchError((error: Error) => {
          return observableThrowError(error);
        })
      )
  
  }

  
}