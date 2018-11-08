import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { INuggetInfo } from './nugget-info';

@Injectable({
  providedIn: 'root'
})
export class NuggetService {
  nuggets$: Observable<INuggetInfo[]> = of([
    {
      name: 'Test 1',
      code: 'function() {}'
    },
    {
      name: 'Test 2',
      code: 'function() {}'
    }
  ]);

  constructor() {}
}
