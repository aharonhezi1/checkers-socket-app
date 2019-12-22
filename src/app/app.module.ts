import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { UsersComponent } from './users/users.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChallengeModalComponent } from './challenge-modal/challenge-modal.component';
import { RefuseModalComponent } from './refuse-modal/refuse-modal.component';

const config: SocketIoConfig = { url: 'http://localhost:3030', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    UsersComponent,
    SidenavComponent,
    LoginComponent,
    ChallengeModalComponent,
    RefuseModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
