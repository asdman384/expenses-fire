import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen.compoent/main-screen.component';
import { StatsComponent } from './stats.component/stats.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
    { path: '', component: MainScreenComponent, canActivate: [AngularFireAuthGuard] },
    { path: 'stats', component: StatsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AngularFireAuthGuard]
})
export class AppRoutingModule { }
