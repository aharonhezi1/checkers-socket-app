import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login/login.service';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { map, tap, takeUntil } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { environment } from './../environments/environment';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  isLogin = false;
  sub;
  myProfile;

  login = 'login'
  constructor(private loginService: LoginService, private socket: Socket) { }


  ngOnInit() {
    console.log(environment);


    this.loginService.myProfile.takeUntil(this.destroy$).subscribe(profile => {
      this.myProfile = profile;
      if (profile) {
        console.log(profile);

        const token = profile.user.token;

        localStorage.setItem(this.login, token);
      }
    });
    if (localStorage.getItem(this.login)) {
      let token = localStorage.getItem(this.login);
      token = JSON.stringify(token);
      token= JSON.parse(token);
      console.log('token',token);

      this.socket.emit('login', { token });

    }

    this.sub = this.loginService.isLogin.takeUntil(this.destroy$).subscribe(islogin =>
      this.isLogin = islogin);
  }
  ngOnDestroy() {
    this.destroy$.unsubscribe();

  }

}
