import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']

})
export class BoardComponent implements OnInit {
  selectedPiece;
  nextMove;
  isBlackPlayerTurn = false;
  isBlackPlayer;
  constructor(private boardService: BoardService, private socket: Socket) { }
  columns = [1, 2, 3, 4, 5, 6, 7, 8];
  rows = this.columns;

  redPiecesPosition = [];

  blackPiecesPosition = [];
  isRedPieceInCell(row, col) {
    return this.redPiecesPosition && this.redPiecesPosition.some(cell => cell[0] === row && cell[1] === col);
  }
  isBlackPieceInCell(row, col) {
    return this.blackPiecesPosition && this.blackPiecesPosition.some(cell => cell[0] === row && cell[1] === col);
  }
  isWhiteCell(position: [number, number]) {
    let evenRow = true;
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = evenRow ? 0 : 1; j < this.columns.length; j += 2) {
        if (position[0] === i && position[1] === j) {
          return false;
        }
      }
      evenRow = !evenRow;
    }
    return true;
  }
  isCorrectDirectionMove(position: [number, number], isBlackPlayer) {
    let isDiagonalLine;
    let isCorrectLine;
    const directionFactor = isBlackPlayer ? 1 : -1;
    console.log(this.selectedPiece);
    if (this.selectedPiece) {
      isDiagonalLine = Math.abs(this.selectedPiece.position[0] - position[0]) === Math.abs(this.selectedPiece.position[1] - position[1]);
      isCorrectLine = (this.selectedPiece.position[0] - position[0]) === directionFactor;

    }
    return isDiagonalLine && isCorrectLine;
  }
  isEmptyCell(position: [number, number]) {
    if (this.isBlackPieceInCell(position[0], position[1]) || this.isRedPieceInCell(position[0], position[1])) {
      return false;
    }
    return true;
  }
  isValidMove(position: [number, number], isBlackPlayer?) {
    if (!this.isWhiteCell(position)) {
      return false;
    }
    if (!this.isCorrectDirectionMove(position, isBlackPlayer)) {
      return false;
    }
    if (!this.isEmptyCell(position)) {
      return false;
    }
    return true;
  }

  onClickBoard(row, col) {
    if (!this.selectedPiece) {
      console.log(row, col);
      if (this.isBlackPlayerTurn && this.isBlackPlayer) {
        if (this.isBlackPieceInCell(row, col)) {
          console.log('black');
          return this.boardService.selectedPiece.next(
            { isBlackPiece: true, position: [row, col] });
        }
      }
      if (!this.isBlackPlayerTurn && !this.isBlackPlayer) {
        if (this.isRedPieceInCell(row, col)) {
          console.log('red');
          return this.boardService.selectedPiece.next(
            { isBlackPiece: false, position: [row, col] });
        }
      }
    } else {
      const lastPosition = this.selectedPiece.position;
      if (!(lastPosition[0] === row && lastPosition[1] === col)) {
        // switching piece
        if (this.isBlackPlayerTurn) {
          if (this.isBlackPlayer && this.isBlackPieceInCell(row, col)) {
            console.log('switch');
            return this.boardService.selectedPiece.next(
              { isBlackPiece: true, position: [row, col] });
          }
        } else {
          if (!this.isBlackPlayer && this.isRedPieceInCell(row, col)) {
            console.log('switch');
            return this.boardService.selectedPiece.next(
              { isBlackPiece: false, position: [row, col] });
          }
        }
        if (!this.isValidMove([row, col], this.isBlackPlayer)) {
          return console.log('not vallid move!');
        }
        if (this.isBlackPlayer && this.selectedPiece.isBlackPiece) {
          this.blackPiecesPosition = this.blackPiecesPosition.filter(cell =>
            !(cell[0] === lastPosition[0] && cell[1] === lastPosition[1]));
          this.blackPiecesPosition.push([row, col]);
          this.boardService.blackPiecesOnBoard.next(this.blackPiecesPosition);
          this.nextMove = {
            isBlackPlayerTurn: this.isBlackPlayerTurn,
            redPiecesPosition: this.redPiecesPosition,
            blackPiecesPosition: this.blackPiecesPosition
          };
        }
        if (!this.isBlackPlayer && !this.selectedPiece.isBlackPiece) {
          this.redPiecesPosition = this.redPiecesPosition.filter(cell =>
            !(cell[0] === lastPosition[0] && cell[1] === lastPosition[1]));
          this.redPiecesPosition.push([row, col]);
          this.boardService.redPiecesOnBoard.next(this.redPiecesPosition);
          this.nextMove = {
            isBlackPlayerTurn: this.isBlackPlayerTurn,
            redPiecesPosition: this.redPiecesPosition,
            blackPiecesPosition: this.blackPiecesPosition
          };
        }
        this.boardService.selectedPiece.next(null);
      }
      // socket
      this.boardService.postBoard(this.nextMove);
    }
  }
  ngOnInit() {
    this.boardService.selectedPiece.subscribe(selectedPiece =>
      this.selectedPiece = selectedPiece);
    this.boardService.blackPiecesOnBoard.subscribe(positions =>
      this.blackPiecesPosition = positions);
    this.boardService.redPiecesOnBoard.subscribe(positions =>
      this.redPiecesPosition = positions);
    this.boardService.setNewBoard();
    this.boardService.isBlackPlayer.subscribe(isBlackPlayer =>
      this.isBlackPlayer = isBlackPlayer);
    this.boardService.isBlackPlayerTurn.subscribe(isBlackPlayerTurn =>
      this.isBlackPlayerTurn = isBlackPlayerTurn);
    this.socket.on('setBoard', (res) => {
      console.log('setBoard', res);
      this.boardService.redPiecesOnBoard.next(res.redPiecesPosition);
      this.boardService.blackPiecesOnBoard.next(res.blackPiecesPosition);
      this.boardService.isBlackPlayerTurn.next(res.isBlackPlayerTurn);
    });
  }

}
