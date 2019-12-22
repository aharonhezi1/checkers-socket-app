import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { BoardService } from '../board.service';


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


  constructor(private loginService: LoginService, private socket: Socket,private boardService:BoardService) { }
  onSubmit(form: NgForm) {
    this.errorMessage = '';
    if (this.isSign) {
      this.loginService.loginUser(form.value);
      this.errorMessage = this.loginService.errorMessage;
    } else {
      this.loginService.signUpUser(form.value).subscribe();
    }
  }
  onSwitchLogin() {
    // this.loginService.isLogin.next(!this.isLogin);
    this.isSign = !this.isSign;
  }

  ngOnInit() {
    this.sub = this.loginService.isLogin.subscribe(islogin =>
      this.isLogin = islogin);
    this.socket.on('loginUsers', users => {

      if (this.isLogin) {
        this.loginService.users.next(users);
      }
    });
    this.socket.fromEvent<any>('auth').subscribe(user => {
      if (!user.error) {
        this.loginService.isLogin.next(true);
        this.loginService.myProfile.next(user);
      } else {

        console.log(user.error);
      }
    }
    )

  }
  ngOnDestroy() {
    this.sub.unsubscribe();

  }

}
