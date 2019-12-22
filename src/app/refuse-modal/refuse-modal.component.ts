import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-refuse-modal',
  templateUrl: './refuse-modal.component.html',
  styleUrls: ['./refuse-modal.component.css']
})
export class RefuseModalComponent implements OnInit {
@Input()refuseMessage;
  constructor() { }

  ngOnInit() {
  }

}
