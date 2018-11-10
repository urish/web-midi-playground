import { Injectable, NgZone } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';
import { firebase } from './firebase-config';
import { INuggetInfo } from './nugget-info';

@Injectable({
  providedIn: 'root'
})
export class NuggetService {
  readonly authPromise = firebase.auth().signInAnonymously();

  readonly nuggets$ = from(this.authPromise).pipe(
    mergeMap(() => this.nuggetSnapshot$),
    map(snapshot => {
      return snapshot.docs.map(
        docSnapshot =>
          ({
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as INuggetInfo)
      );
    }),
    shareReplay()
  );

  constructor(private ngZone: NgZone) {}

  private readonly nuggetSnapshot$ = new Observable<
    firebase.firestore.QuerySnapshot
  >(observer =>
    this.ngZone.run(() => this.nuggetsCollection.onSnapshot(observer))
  );

  private get nuggetsCollection() {
    return firebase.firestore().collection('nuggets');
  }

  nugget(id: string) {
    return this.nuggets$.pipe(map(nuggets => nuggets.find(n => n.id === id)));
  }

  save(id: string, code: string) {
    this.nuggetsCollection.doc(id).set({ code });
  }
}
