import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BoardService } from '../board.service';
import { Socket } from 'ngx-socket-io';
import { LoginService } from '../login/login.service';
import { UsersApiService } from '../users/users-api.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']

})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('openRefuseModal', { static: false }) openRefuseModal: ElementRef;

  selectedPiece;
  capturedEnemyPosition = [];
  nextMove;
  isBlackPlayerTurn = false;
  isBlackPlayer;
  refuseMessage;
  isAccept;
  myId;
  myName;
  isAvailable = true;
  isGameOver;
  isWinner;

  constructor(private boardService: BoardService, private socket: Socket, private loginService: LoginService, private usersApiService: UsersApiService) { }
  columns = [1, 2, 3, 4, 5, 6, 7, 8];
  rows = this.columns;

  redPiecesPosition = [];
  redKingsPosition = [];
  blackKingsPosition = [];


  blackPiecesPosition = [];
  gameOver() {
    if (!this.isAvailable) {
      if (!this.redPiecesPosition.length) {
        this.isWinner = this.isBlackPlayer;
      }
      if (!this.blackPiecesPosition.length) {
        this.isWinner = !this.isBlackPlayer;
      }
    }
    if (this.isWinner) {
      this.usersApiService.incrementNumOfGamesAndWins(false, true).subscribe();
    }
    this.isGameOver = !this.blackPiecesPosition.length || !this.redPiecesPosition.length;
  }
  onQuit() {
    console.log('onQuit');

    if (!this.isAvailable && this.myName) {
      this.redPiecesPosition = [];
      this.blackPiecesPosition = [];
      const reply = {
        reply: false,
        quit: true,
        room: this.boardService.room,
        challengedUserId: this.myId,
        challengedUserName: this.myName
      };
      this.socket.emit('reply', reply);

    }
  }
  crowning(position) {
    if (this.isBlackPlayerTurn && position[0] === 0 &&
      !this.blackKingsPosition.some(pos => this.isSamePiece(position, pos))) {
      this.blackKingsPosition.push(position);
    } else if (position[0] === 7 &&
      !this.redKingsPosition.some(pos => this.isSamePiece(position, pos))) {
      this.redKingsPosition.push(position);
    }
  }
  isRedPieceInCell(row, col) {
    return this.redPiecesPosition && this.redPiecesPosition.some(cell => cell[0] === row && cell[1] === col);
  }

  isRedKingInCell(row, col) {
    return this.redKingsPosition && this.redKingsPosition.some(cell => cell[0] === row && cell[1] === col);
  }
  isBlackKingInCell(row, col) {
    return this.blackKingsPosition && this.blackKingsPosition.some(cell => cell[0] === row && cell[1] === col);
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
  isKing(position: [number, number]) {
    return this.isRedKingInCell(...position) || this.isBlackKingInCell(...position);
  }
  isValidKingMove(position, isBlackPlayer) {
    const isDiagonalLine = Math.abs(this.selectedPiece.position[0] - position[0]) ===
      Math.abs(this.selectedPiece.position[1] - position[1]);

    const pastByCells = [];
    const rowIncrement = this.selectedPiece.position[0] > position[0] ? -1 : 1;
    const colIncrement = this.selectedPiece.position[1] > position[1] ? -1 : 1;
    for (let i = 1; i <= Math.abs(this.selectedPiece.position[0] - position[0]); i++) {
      pastByCells.push([this.selectedPiece.position[0] + i * rowIncrement, this.selectedPiece.position[1] + i * colIncrement]);
    }
    console.log('pastByCells', pastByCells);
    const isValidMove = !pastByCells.some((cell: [number, number], i) => {
      const isEnemyinCell = isBlackPlayer ? this.isRedPieceInCell(...cell) :
        this.isBlackPieceInCell(...cell);
      if (this.isEmptyCell(cell)) { return false; }
      if ((isEnemyinCell && pastByCells[i + 1] && this.isEmptyCell(pastByCells[i + 1]))) {
        this.capturedEnemyPosition.push(cell);
        return false;
      }
      return true;
    });
    console.log('capturedEnemyPosition', this.capturedEnemyPosition);

    return isDiagonalLine && isValidMove;
  }
  isCorrectDirectionMove(position: [number, number], isBlackPlayer) {
    let isDiagonalLine;
    let isCorrectLine;
    let isCorrectCapturingLine;
    const positionOfEnemy = [];
    const directionFactor = isBlackPlayer ? 1 : -1;
    let isEnemyinCell;
    isDiagonalLine = Math.abs(this.selectedPiece.position[0] - position[0]) === Math.abs(this.selectedPiece.position[1] - position[1]);
    isCorrectLine = (this.selectedPiece.position[0] - position[0]) === directionFactor;
    isCorrectCapturingLine = (this.selectedPiece.position[0] - position[0]) === directionFactor * 2;
    positionOfEnemy[0] = this.selectedPiece.position[0] > position[0] ? this.selectedPiece.position[0] - 1 : position[0] - 1;
    positionOfEnemy[1] = this.selectedPiece.position[1] > position[1] ? this.selectedPiece.position[1] - 1 : position[1] - 1;
    isEnemyinCell = isBlackPlayer ? this.isRedPieceInCell(positionOfEnemy[0], positionOfEnemy[1]) :
      this.isBlackPieceInCell(positionOfEnemy[0], positionOfEnemy[1]);
    // if (this.isKing(this.selectedPiece.position)) {
    //   return isDiagonalLine && this.isValidKingMove(position, isBlackPlayer)
    // }
    if (isCorrectCapturingLine && isEnemyinCell && isDiagonalLine) {
      this.capturedEnemyPosition.push([positionOfEnemy[0], positionOfEnemy[1]]);
      return true;
    }
    return (isDiagonalLine && isCorrectLine);
  }
  isEmptyCell(position: [number, number]) {
    if (this.isBlackPieceInCell(position[0], position[1]) || this.isRedPieceInCell(position[0], position[1])) {
      return false;
    }
    return true;
  }
  isValidMove(position: [number, number], isBlackPlayer?) {
    if (this.isKing(this.selectedPiece.position)) {
      return this.isWhiteCell(position) && this.isValidKingMove(position, isBlackPlayer);
    }
    // if (!this.isWhiteCell(position)) {
    //   return false;
    // }
    // if (!this.isCorrectDirectionMove(position, isBlackPlayer)) {
    //   return false;
    // }
    // if (!this.isEmptyCell(position)) {
    //   return false;
    // }
    return this.isWhiteCell(position) &&
      this.isCorrectDirectionMove(position, isBlackPlayer) &&
      this.isEmptyCell(position);
  }
  switchPiece(row, col) {
    if (this.isBlackPlayerTurn) {
      if (this.isBlackPlayer && this.isBlackPieceInCell(row, col)) {
        console.log('switch');
        this.boardService.selectedPiece.next(
          { isBlackPiece: true, position: [row, col], isKing: this.isBlackKingInCell(row, col) });
        return true;
      }
    } else {
      if (!this.isBlackPlayer && this.isRedPieceInCell(row, col)) {
        console.log('switch');
        this.boardService.selectedPiece.next(
          { isBlackPiece: false, position: [row, col], isKing: this.isRedKingInCell(row, col) });
        return true;
      }

    }
    return false;
  }
  removePlayerFromArray(array, position) {
    return array.filter(cell => !this.isSamePiece(cell, position));
  }
  killPiece(positions) {
    positions.forEach((position: [number, number]) => {
      if (this.isBlackPlayer) {
        this.redPiecesPosition = this.removePlayerFromArray(this.redPiecesPosition, position);
        if (this.isRedKingInCell(...position)) {
          this.redKingsPosition = this.removePlayerFromArray(this.redKingsPosition, position);
        }
      } else {
        this.blackPiecesPosition = this.removePlayerFromArray(this.blackPiecesPosition, position);
        if (this.isBlackKingInCell(...position)) {
          this.blackKingsPosition = this.removePlayerFromArray(this.blackKingsPosition, position);
        }
      }

    });

    this.capturedEnemyPosition = [];
  }
  movePiece(lastPosition: [number, number], newPosition) {
    if (this.isBlackPlayer && this.selectedPiece.isBlackPiece) {
      this.blackPiecesPosition = this.removePlayerFromArray(this.blackPiecesPosition, lastPosition);
      this.blackPiecesPosition.push(newPosition);
      if (this.isBlackKingInCell(...lastPosition)) {
        this.blackKingsPosition = this.removePlayerFromArray(this.blackKingsPosition, lastPosition);
        this.blackKingsPosition.push(newPosition);
      }
      this.boardService.blackPiecesOnBoard.next(this.blackPiecesPosition);
    }
    if (!this.isBlackPlayer && !this.selectedPiece.isBlackPiece) {
      this.redPiecesPosition = this.removePlayerFromArray(this.redPiecesPosition, lastPosition);
      this.redPiecesPosition.push(newPosition);
      if (this.isRedKingInCell(...lastPosition)) {
        this.redKingsPosition = this.removePlayerFromArray(this.redKingsPosition, lastPosition);
        this.redKingsPosition.push(newPosition);
      }
      this.boardService.redPiecesOnBoard.next(this.redPiecesPosition);
    }
  }
  choosePiece(row, col) {
    if (this.isBlackPlayerTurn && this.isBlackPlayer) {
      if (this.isBlackPieceInCell(row, col)) {
        console.log('black');
        return this.boardService.selectedPiece.next(
          { isBlackPiece: true, position: [row, col], isKing: this.isBlackKingInCell(row, col) });
      }
    }
    if (!this.isBlackPlayerTurn && !this.isBlackPlayer) {
      if (this.isRedPieceInCell(row, col)) {
        console.log('red');
        return this.boardService.selectedPiece.next(
          { isBlackPiece: false, position: [row, col], isKing: this.isRedKingInCell(row, col) });
      }
    }

  }
  isSamePiece(lastPosition, Newposition) {
    return (lastPosition[0] === Newposition[0] && lastPosition[1] === Newposition[1]);
  }
  onClickBoard(row, col) {
    if (!this.selectedPiece) {
      console.log(row, col);
      return this.choosePiece(row, col);
    } else {
      const lastPosition = this.selectedPiece.position;
      if (!this.isSamePiece(lastPosition, [row, col])) {

        const isSwitchPiece = this.switchPiece(row, col);
        if (isSwitchPiece) {
          return this.switchPiece(row, col);
        }
        if (!this.isValidMove([row, col], this.isBlackPlayer)) {
          return console.log('not vallid move!');
        }
        if (this.capturedEnemyPosition) {
          this.killPiece(this.capturedEnemyPosition);
        }
        this.movePiece(lastPosition, [row, col]);
        this.crowning([row, col]);
        this.boardService.selectedPiece.next(null);

        // socket
        this.nextMove = {
          isBlackPlayerTurn: this.isBlackPlayerTurn,
          redPiecesPosition: this.redPiecesPosition,
          blackPiecesPosition: this.blackPiecesPosition,
          redKingsPosition: this.redKingsPosition,
          blackKingsPosition: this.blackKingsPosition
        };
        if (!this.isGameOver) {
          this.boardService.postBoard(this.nextMove);
        }
      }
      this.gameOver();

    }

  }
  ngOnInit() {

    this.boardService.disconnectSubject.subscribe((diconnect) => {
      if (diconnect) {
        this.onQuit();
      }
    });
    this.loginService.myProfile.subscribe(profile => {
      console.log(profile);
      if (profile) {
        this.myId = profile.user.id;
        this.myName = profile.user.name;
        this.isAvailable = profile.user.isAvailable;
      } else {
        this.myName = '';
      }

    });
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
      this.redKingsPosition = res.redKingsPosition;
      this.blackKingsPosition = res.blackKingsPosition;
      this.gameOver()
    });

  }
  ngAfterViewInit() {
    this.socket.fromEvent<any>('answer').subscribe(reply => {
      if (reply.reply) {
        this.socket.emit('startGame', reply.room);
        this.boardService.isAvailable.next(false);
        this.usersApiService.incrementNumOfGamesAndWins(true, false).subscribe();

        this.isAccept = true;
      } else if (!this.isAccept || reply.quit) {
        if (reply.quit) {
          this.usersApiService.incrementNumOfGamesAndWins(false, true).subscribe();
        }
        this.refuseMessage = reply.challengedUserName + " refused the match!";
        this.openRefuseModal.nativeElement.click();
      }

    });
  }
}
