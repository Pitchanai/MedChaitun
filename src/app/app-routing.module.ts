import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// import { CustomPreloading } from './core/custom-preloading'

import { FriendsComponent } from './friends/friends.component'
import { MainComponent } from './main/main.component'

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'friends',
    component: FriendsComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {}