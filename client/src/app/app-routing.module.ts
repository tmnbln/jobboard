import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobBoardComponent } from './job-board/job-board.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
