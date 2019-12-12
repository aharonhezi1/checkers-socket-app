import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { UsersComponent } from './users/users.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3030', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    UsersComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
