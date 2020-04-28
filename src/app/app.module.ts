import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { FriendsComponent } from './friends/friends.component'
import { AppRoutingModule } from './app-routing.module'
import { MainComponent } from './main/main.component';


@NgModule({
   declarations: [
      AppComponent,
      FriendsComponent,
      MainComponent
   ],
   imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
