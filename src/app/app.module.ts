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
import { EnvServiceProvider } from './env.service.provider';
import { EnvService } from './env.service';
import { environment } from './../environments/environment';


// const env = new EnvService();
// const config: SocketIoConfig = { url: env.apiUrl + ":" + env.port, options: {} };
// const config: SocketIoConfig = { url: 'ec2-34-227-148-24.compute-1.amazonaws.com:3030', options: {} };

const config: SocketIoConfig = { url: environment.apiUrl + ':' + environment.port, options: {} };


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
  providers: [EnvServiceProvider],

  bootstrap: [AppComponent]
})
export class AppModule { }
