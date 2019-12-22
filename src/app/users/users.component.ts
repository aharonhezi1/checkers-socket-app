import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BoardService } from '../board.service';
import { UsersApiService } from './users-api.service';
import { LoginService } from '../login/login.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  player = {
    reqUserName: '',
    reqUsernumberOfGames: '',
    reqUsernumberOfVictories: '',
  };
  isAvailable = true;
  myProfile;
  users = [];
  isUserClicked = false;
  @ViewChild('openChallengeModal', { static: false }) openChallengeModal: ElementRef;
  @ViewChild('challengeModal', { static: false }) challengeModal: any;

  constructor(private socket: Socket,
    private boardService: BoardService,
    private usersApiService: UsersApiService,
    private loginService: LoginService) { }


  onClickUser(user) {
    console.log();
    const id = this.myProfile.id;
    const userId = user.id;
    console.log(this.myProfile.user);

    if (this.myProfile.user.id !== user.id && this.boardService.isAvailable) {
      this.socket.emit('requestMatch', {
        reqUserName: this.myProfile.user.name,
        reqUserId: this.myProfile.user.id,
        reqUsernumberOfGames: this.myProfile.user.numberOfGames,
        reqUsernumberOfVictories: this.myProfile.user.numberOfVictories,
        challengedUserName: user.name,
        challengedUserId: user.id
      });
    }
    this.isUserClicked = !this.isUserClicked;
  }


  ngOnInit() {

    this.boardService.isAvailable.subscribe(isAvailable => {
      this.isAvailable = isAvailable;
    });
    this.loginService.users.subscribe(users => {
      this.users = users;
    });
    this.loginService.myProfile.subscribe(myProfile =>
      this.myProfile = myProfile);
    this.socket.fromEvent<any>('hello').subscribe(socket =>
      console.log(socket));

  }
  ngAfterViewInit() {
    this.socket.fromEvent<any>('requestMatchToUser').subscribe(player => {
      if (this.boardService.isAvailable){
      this.player = { ...player, challengedUserName: this.myProfile.user.name };
      this.openChallengeModal.nativeElement.click();
      }
    });
    // this.challengeModal.on("hidden.bs.modal", () => {
    //   console.log('hidden.bs.modal');
    $("#challengeModal").on('hide.bs.modal', () => {
      console.log('hide.bs.modal');
      this.socket.emit('reply', { reply: false, ...this.player });

    });

  }

}
