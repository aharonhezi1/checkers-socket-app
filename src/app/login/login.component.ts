import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { BoardService } from '../board.service';
import { error } from 'util';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLogin: boolean;
  sub;
  isSign: boolean;
  errorMessage;
  myId;
  message;
  isLoading;


  constructor(private loginService: LoginService, private socket: Socket, private boardService: BoardService) { }
  onSubmit(form: NgForm) {
    this.errorMessage = '';
    if (this.isSign) {
      this.loginService.loginUser(form.value);

    } else {
      this.loginService.signUpUser(form.value).subscribe(res=>{
        this.message='You can now login!'
      },error=>{
      this.isLoading=true
        this.errorMessage='Sgin up failed!'
      });
      this.isLoading=false
    }
  }
  onSwitchLogin() {
    // this.loginService.isLogin.next(!this.isLogin);
    this.isSign = !this.isSign;
    this.errorMessage='';
  }

  ngOnInit() {
    console.log(this.socket);

    this.sub = this.loginService.isLogin.subscribe(islogin =>
      this.isLogin = islogin);
    this.socket.on('loginUsers', users => {

      if (this.isLogin) {
        this.loginService.users.next(users);
        users.forEach(user => {
          if(user.id===this.myId){
            this.boardService.isAvailable.next(user.isAvailable)
          }
        });
      }
    });
    this.socket.fromEvent<any>('auth').subscribe(user => {
      if (!user.error) {
        console.log(user);

        this.loginService.isLogin.next(true);
        this.loginService.myProfile.next(user);
        this.myId = user.user.id
      } else {
        this.loginService.errorMessage.next(user.error)
        console.log(user.error);
      }
    }
    );
    this.loginService.errorMessage.subscribe(errorMessage=>
      this.errorMessage=errorMessage)

  }
  ngOnDestroy() {
    this.sub.unsubscribe();

  }

}
