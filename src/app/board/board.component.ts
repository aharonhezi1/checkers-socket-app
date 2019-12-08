import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  cellID;
  click = false;
  constructor(private boardService: BoardService) { }
  columns = [1, 2, 3, 4, 5, 6, 7, 8];
  rows = this.columns;
  // isWhitecell = true;
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


  trackByFn(index, item) {
    return index % 2 === 0;
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
  isValidMove(position: [number, number]) {
    if (!this.isWhiteCell(position)) {
      return false;
    }
    return true;

  }
  onClickTD(row, col) {
    this.click = true;
    this.boardService.selectedPiece.subscribe(selectedPiece => {
      if (!selectedPiece && this.click) {
        this.click = false;
        console.log(row, col);

        if (this.isBlackPieceInCell(row, col)) {
          console.log('black');
          return this.boardService.selectedPiece.next(
            { isBlackPiece: true, position: [row, col] });
        }

        if (this.isRedPieceInCell(row, col)) {
          console.log('red');
          return this.boardService.selectedPiece.next(
            { isBlackPiece: false, position: [row, col] });
        }

      } else if (this.click) {
        this.click = false;

        if (!this.isValidMove([row, col])) {
          return console.log('white');
        }
        const lastPosition = selectedPiece.position;
        if (selectedPiece.isBlackPiece) {
          this.blackPiecesPosition = this.blackPiecesPosition.filter(cell => !(cell[0] === lastPosition[0] && cell[1] === lastPosition[1]));
          this.blackPiecesPosition.push([row, col]);
        } else {
          this.redPiecesPosition = this.redPiecesPosition.filter(cell => !(cell[0] === lastPosition[0] && cell[1] === lastPosition[1]));
          this.redPiecesPosition.push([row, col]);

        }
        if (!(lastPosition[0] === row && lastPosition[1] === col)) {
          this.boardService.selectedPiece.next(null);
        }

      }
    });

  }

  ngOnInit() {
  }

}
