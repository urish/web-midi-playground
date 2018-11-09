import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NuggetEditorComponent } from './nugget-editor/nugget-editor.component';

const routes: Routes = [
  {
    path: 'nuggets/:id',
    component: NuggetEditorComponent
  },
  {
    path: '**',
    redirectTo: 'nuggets/new'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
