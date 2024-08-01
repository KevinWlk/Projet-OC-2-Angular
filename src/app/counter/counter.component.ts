import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./counter.component.scss']
})

export class CounterComponent implements OnInit {
  @Input() title: string = '';
  @Input() count$: Observable<number> = new Observable<number>();

  constructor() {}

  ngOnInit(): void {}
}
