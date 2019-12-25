import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BoardService } from '../board.service';
import { UsersApiService } from '../users/users-api.service';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html',
  styleUrls: ['./challenge-modal.component.css']
})
export class ChallengeModalComponent implements OnInit, AfterViewInit {
  @Input() player;
  @ViewChild('closeModalChallenge', { static: false }) closeModalChallenge: ElementRef;

  constructor(private usersApiService:UsersApiService, private socket: Socket, private boardService:BoardService) { }
  onRrefuse() {
    this.socket.emit('reply', { reply: false , ...this.player});
  }
  onEccept() {
    this.socket.emit('reply', { reply: true , ...this.player, });
    this.socket.emit('startGame', this.player.reqUserId);
    this.usersApiService.incrementNumOfGamesAndWins(true,false).subscribe()

    this.boardService.isAvailable.next(false);
    this.closeModalChallenge.nativeElement.click();

  }
  ngOnInit() {
  }
  ngAfterViewInit() {
   // this.closeModalChallenge.nativeElement.on('hide.bs.modal',this.onRrefuse())
  }

}
