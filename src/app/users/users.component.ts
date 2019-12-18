import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BoardService } from '../board.service';
import { UsersApiService } from './users-api.service';
import { error } from 'util';
import { LoginService } from '../login/login.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  user = { name: 'Jd' };
  users = [];
  isUserClicked = false;
  constructor(private socket: Socket,
    private boardService: BoardService,
    private usersApiService: UsersApiService,
    private loginService: LoginService) { }

  onClickUser(user) {
    console.log(user);
    this.isUserClicked = !this.isUserClicked;
  }
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
    // this.socket.fromEvent<any>('loginUsers').subscribe( users => {
    //   console.log('loginUsers', users)
    //   this.users = users;
    //   this.loginService.isLogin.next(true);

    // });
    this.loginService.users.subscribe(users => {
      this.users = users;
    });

    this.socket.fromEvent<any>('hello').subscribe(socket =>
      console.log(socket));

  }

}
