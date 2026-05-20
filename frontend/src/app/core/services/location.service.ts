import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Location } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations: Location[] = [
    { id: 1, name: 'Delhi NCR', type: 'city' },
    { id: 2, name: 'Noida Sec 62', type: 'neighborhood' },
    { id: 3, name: 'Gurugram Sec 45', type: 'neighborhood' },
    { id: 4, name: 'Mumbai', type: 'city' },
    { id: 5, name: 'Andheri West', type: 'neighborhood' },
    { id: 6, name: 'Bandra', type: 'neighborhood' },
    { id: 7, name: 'Bengaluru', type: 'city' },
    { id: 8, name: 'Indiranagar', type: 'neighborhood' },
    { id: 9, name: 'HSR Layout', type: 'neighborhood' },
    { id: 10, name: 'Koramangala', type: 'neighborhood' },
    { id: 11, name: 'Hyderabad', type: 'city' },
    { id: 12, name: 'Jubilee Hills', type: 'neighborhood' }
  ];

  private selectedLocationSubject = new BehaviorSubject<Location>(this.locations[7]); // Default: Bengaluru
  public selectedLocation$ = this.selectedLocationSubject.asObservable();

  constructor() {}

  public getLocations(): Observable<Location[]> {
    return of(this.locations).pipe(delay(300));
  }

  public selectLocation(location: Location): void {
    console.log('Location updated to:', location.name);
    this.selectedLocationSubject.next(location);
  }

  public getSelectedLocation(): Location {
    return this.selectedLocationSubject.value;
  }
}
