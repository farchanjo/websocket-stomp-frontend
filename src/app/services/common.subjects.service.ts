import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketEventSubjectsService<T> {
  protected EVENT_SUBJECT = new Subject();
  public event = this.EVENT_SUBJECT.asObservable();

  // tslint:disable-next-line:no-shadowed-variable
  dispathEvent(T) {
    this.EVENT_SUBJECT.next(T);
  }
}

@Injectable({
  providedIn: 'root',
})
export class DestinationSubjectsService<T> {
  protected EVENT_SUBJECT = new Subject();
  public event = this.EVENT_SUBJECT.asObservable();

  // tslint:disable-next-line:no-shadowed-variable
  dispathEvent(T) {
    this.EVENT_SUBJECT.next(T);
  }
}
