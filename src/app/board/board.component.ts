import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  selectedPiece;
  cellID;
  click = false;
  isBlackPlayerTurn = false;
  constructor(private boardService: BoardService) { }
  columns = [1, 2, 3, 4, 5, 6, 7, 8];
  rows = this.columns;

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
  isRedPieceInCell(row, col) {
    return this.redPiecesPosition.some(cell => cell[0] === row && cell[1] === col);
  }
  isBlackPieceInCell(row, col) {
    return this.blackPiecesPosition.some(cell => cell[0] === row && cell[1] === col);
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
  isCorrectDirectionMove(position: [number, number], isBlackPlayerTurn) {
    let isDiagonalLine;
    let isCorrectLine;
    const directionFactor = isBlackPlayerTurn ? 1 : -1;
    // this.boardService.selectedPiece.subscribe(selectedPiece => {
    console.log(this.selectedPiece);
    if (this.selectedPiece) {
      isDiagonalLine = Math.abs(this.selectedPiece.position[0] - position[0]) === Math.abs(this.selectedPiece.position[1] - position[1])
      isCorrectLine = (this.selectedPiece.position[0] - position[0]) === -directionFactor;

    }
    //  });
    return isDiagonalLine && isCorrectLine;
  }
  isEmptyCell(position: [number, number]) {
    if (this.isBlackPieceInCell(position[0], position[1]) || this.isRedPieceInCell(position[0], position[1])) {
      return false;
    }
    return true;
  }
  isValidMove(position: [number, number], isBlackPlayerTurn?) {
    if (!this.isWhiteCell(position)) {
      return false;
    }
    if (!this.isCorrectDirectionMove(position, isBlackPlayerTurn)) {
      return false;
    }
    if (!this.isEmptyCell(position)) {
      return false;
    }
    return true;

  }
  switchPiece(row, col) {

  }
  onClickTD(row, col) {
    this.click = true;
    // this.boardService.selectedPiece.subscribe(selectedPiece => {
    if (!this.selectedPiece && this.click) {
      this.click = false;
      console.log(row, col);
      if (this.isBlackPlayerTurn) {
        if (this.isBlackPieceInCell(row, col)) {
          console.log('black');
          this.isBlackPlayerTurn = !this.isBlackPlayerTurn;
          return this.boardService.selectedPiece.next(
            { isBlackPiece: true, position: [row, col] });
        }
      } else {
        if (this.isRedPieceInCell(row, col)) {
          console.log('red');
          this.isBlackPlayerTurn = !this.isBlackPlayerTurn;
          return this.boardService.selectedPiece.next(
            { isBlackPiece: false, position: [row, col] });
        }
      }
    } else if (this.click) {
      this.click = false;
      const lastPosition = this.selectedPiece.position;
      if (!(lastPosition[0] === row && lastPosition[1] === col)) {
        // switching piece
        if (!this.isBlackPlayerTurn) {
          if (this.isBlackPieceInCell(row, col)) {
            console.log('switch');
            return this.boardService.selectedPiece.next(
              { isBlackPiece: true, position: [row, col] });
          }

        } else {
          if (this.isRedPieceInCell(row, col)) {
            console.log('switch');
            return this.boardService.selectedPiece.next(
              { isBlackPiece: false, position: [row, col] });
          }
        }
        if (!this.isValidMove([row, col], this.isBlackPlayerTurn)) {
          return console.log('not vallid move!');
        }
        if (this.selectedPiece.isBlackPiece) {
          this.blackPiecesPosition = this.blackPiecesPosition.filter(cell =>
            !(cell[0] === lastPosition[0] && cell[1] === lastPosition[1]));
          this.blackPiecesPosition.push([row, col]);
        } else {
          this.redPiecesPosition = this.redPiecesPosition.filter(cell =>
            !(cell[0] === lastPosition[0] && cell[1] === lastPosition[1]));
          this.redPiecesPosition.push([row, col]);
        }
        this.boardService.selectedPiece.next(null);
      }

    }

    // });
  }
  ngOnInit() {
    this.boardService.selectedPiece.subscribe(selectedPiece =>
      this.selectedPiece = selectedPiece
    )

  }

}
