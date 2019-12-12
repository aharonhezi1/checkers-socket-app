import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BoardService } from '../board.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  user = { name: 'Jd' };

  constructor(private socket: Socket, private boardService: BoardService) { }
  columns = [, , , , , , , 1];
  onJoin() {
    this.socket.emit('start game', {
      user: this.user,
      redPiecePosition: this.boardService.redPiecesPosition,
      blackPiecesPosition: this.boardService.blackPiecesPosition
    });
    // this.socket.fromEvent<any>('room number & color').subscribe(player => {
    //   console.log(player);
    //   this.boardService.player = player;
    // });
  }

  ngOnInit() {
    this.socket.fromEvent<any>('hello').subscribe(socket =>

      console.log(socket));

  }

}
