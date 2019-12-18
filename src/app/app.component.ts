import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLogin = false;
  sub;
  constructor(private loginService: LoginService) { }
  ngOnInit() {
    this.sub = this.loginService.isLogin.subscribe(islogin =>
      this.isLogin = islogin);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();

  }

}
