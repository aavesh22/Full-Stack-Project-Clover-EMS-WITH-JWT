import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { BenchComponent } from './component/bench/bench.component';
import { NewRequirementComponent } from './component/new-requirement/new-requirement.component';
import { ReplacementComponent } from './component/replacement/replacement.component';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './shared/auth-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    resolve: { auth: AuthResolver },
    children: [
      { path: '', redirectTo: 'bench', pathMatch: 'full' },
      { path: 'bench', component: BenchComponent },
      { path: 'new-requirement', component: NewRequirementComponent },
      { path: 'replacement', component: ReplacementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
