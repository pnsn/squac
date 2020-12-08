import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configuration = {};
  private path : string = '/assets/config.json';
  constructor(private httpClient: HttpClient) {
  }

  // Loads config file
  load(): Observable<void> {
    return this.httpClient.get(this.path)
      .pipe(
        tap((configuration: any) => this.configuration = configuration),
        mapTo(undefined),
      );
  }

  // Returns value of configuration for the key, or default
  getValue(key: string, defaultValue?: any): any {
    return this.configuration[key] || defaultValue;
  }
}

// Used to access config file information
// see /assets/config.json to change values
//
