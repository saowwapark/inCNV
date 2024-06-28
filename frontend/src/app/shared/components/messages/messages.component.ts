import { Component, OnInit } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  showMessages = false;
  errors$: Observable<string[]>;
  constructor(public messagesService: MessagesService) {}
  ngOnInit() {
    const haveMessages$ = this.messagesService.errors$.pipe(
      filter(messages => messages && messages.length > 0),
      tap(() => (this.showMessages = true))
    );
    const notHaveMessages$ = this.messagesService.errors$.pipe(
      filter(messages => !messages || messages.length === 0),
      tap(() => (this.showMessages = false))
    );
    this.errors$ = merge(haveMessages$, notHaveMessages$);
  }
  onClose() {
    this.showMessages = false;
  }
}
