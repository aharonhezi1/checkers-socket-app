import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private socket: Socket) { }
  room;
  isAvailable=new Subject<boolean>();

  redPiecesPosition = [
    [0, 1], [0, 3], [0, 5], [0, 7],
    [2, 1], [2, 3], [2, 5], [2, 7],
    [1, 0], [1, 2], [1, 4], [1, 6],
  ];

  blackPiecesPosition = [
    [5, 0], [5, 2], [5, 4], [5, 6],
    [6, 1], [6, 3], [6, 5], [6, 7],
    [7, 0], [7, 2], [7, 4], [7, 6]
  ];
  isBlackPlayerTurn = new BehaviorSubject<boolean>(false);
  redPiecesOnBoard = new BehaviorSubject<number[][]>([]);
  blackPiecesOnBoard = new BehaviorSubject<number[][]>([]);
  selectedPiece = new BehaviorSubject<{ isBlackPiece: boolean, position: number[] }>(null);
  isBlackPlayer = new Subject<boolean>();
  // setBoard() {
  setBoard = this.socket.fromEvent<any>('setBoard').subscribe((res: any) => {
    console.log('setBoard', res);
    this.redPiecesOnBoard.next(res.redPiecesPosition);
    this.blackPiecesOnBoard.next(res.blackPiecesPosition);
    this.isBlackPlayerTurn.next(res.isBlackPlayerTurn);
  });

  setNewBoard() {
    this.socket.fromEvent<any>('setNewBoard').subscribe((res: any) => {
      console.log(res);
      this.room = res.room;
      this.redPiecesOnBoard.next(res.redPiecesPosition);
      this.blackPiecesOnBoard.next(res.blackPiecesPosition);
      this.isBlackPlayerTurn.next(res.isBlackPlayerTurn);
      this.isBlackPlayer.next(!res.isFirstPlayer);
    });

  }

  // }
  postBoard(nextMove) {
    this.socket.emit('postBoard', { ...nextMove, room: this.room });
    console.log('postBoard', nextMove);


  }

}
