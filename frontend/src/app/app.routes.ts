import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DonateComponent } from './pages/donate/donate.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' }, // Removed the extra space here
    { path: 'register', component: RegisterComponent, pathMatch: 'full' }, // Removed the extra space here
    { path: 'donate', component: DonateComponent, pathMatch: 'full' }, // Removed the extra space here
    // { path: 'stock/:symbol', component: StockPageComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // { path: '**', component: PageNotFoundComponent },
];
