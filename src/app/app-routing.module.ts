import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

// admin
import { SigninComponent as AdminSigninComponent } from './components/admin/auth/signin/signin.component';
import { SidenavComponent as AdminSidenav } from './components/admin/sidenav/sidenav.component';
import { DashboardComponent as AdminDashboard } from './components/admin/admin-services/client-management/dashboard/dashboard.component';
import { UserManagementComponent as AdminUserManagementComponent } from './components/admin/admin-services/user-management/user-management.component';
import { ClientManagementComponent } from './components/admin/admin-services/client-management/client-management.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';

// products
import { SignupComponent } from './components/product/auth/signup/signup.component';
import { SigninComponent } from './components/product/auth/signin/signin.component';
import { SidenavComponent as ProductSideNav } from './components/product/sidenav/sidenav.component';
import { NavbarComponent as ProductNavBar } from './components/product/navbar/navbar.component';
import { ProfileComponent } from './components/product/profile/profile.component';
import { DashboardComponent as ProductDashboard } from './components/product/product-service/dashboard/dashboard.component';
import { BugsComponent } from './components/product/product-service/bugs/bugs.component';
import { ProjectBugsComponent } from './components/product/product-service/project-bugs/project-bugs.component';
import { ProjectsComponent } from './components/product/product-service/projects/projects.component';
import { BugInfoComponent } from './components/product/product-service/bug-info/bug-info.component';
import { AdminAuthGuard } from './shared/auth-guard/admin/auth.guard';
import { ProductAuthGuard } from './shared/auth-guard/product/auth.guard';
import { AdminGuard as ProductAdminGuard } from './shared/auth-guard/product/admin/admin.guard';
import { UserManagementComponent as BugTrackerUserManagementComponent } from './components/product/user-management/user-management.component';
import { LoaderComponent } from './components/loader/loader.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'loader', component: LoaderComponent },

  // Admin page
  { path: 'admin/signin', component: AdminSigninComponent },
  { path: 'admin/sidenav', component: AdminSidenav },
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [AdminAuthGuard] },
  { path: 'admin/profile', component: AdminProfileComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/user-management', component: AdminUserManagementComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/client-management', component: ClientManagementComponent, canActivate: [AdminAuthGuard] },

  // Product page
  { path: 'bugtracker/signup', component: SignupComponent },
  { path: 'bugtracker/signin', component: SigninComponent },
  // { path: 'bugtracker/sidenav', component: ProductSideNav, canActivate: [ProductAuthGuard] },
  { path: 'bugtracker/user-management', component: BugTrackerUserManagementComponent, canActivate: [ProductAuthGuard] },
  // { path: 'bugtracker/navbar', component: ProductNavBar, canActivate: [ProductAuthGuard] },
  { path: 'bugtracker/dashboard', component: ProductDashboard, canActivate: [ProductAuthGuard, ProductAdminGuard] },
  { path: 'bugtracker/profile', component: ProfileComponent, canActivate: [ProductAuthGuard] },
  { path: 'bugtracker/bugs', component: BugsComponent, canActivate: [ProductAuthGuard, ProductAdminGuard] },
  { path: 'bugtracker/project', component: ProjectsComponent, canActivate: [ProductAuthGuard, ProductAdminGuard] },
  { path: 'bugtracker/project/bugs', component: ProjectBugsComponent, canActivate: [ProductAuthGuard, ProductAdminGuard] },
  { path: 'bugtracker/bug/info', component: BugInfoComponent, canActivate: [ProductAuthGuard, ProductAdminGuard] },

  // // Admin page
  // { path: 'admin/signin', component: AdminSigninComponent },
  // { path: 'admin/sidenav', component: AdminSidenav },
  // { path: 'admin/dashboard', component: AdminDashboard },
  // { path: 'admin/profile', component: AdminProfileComponent },
  // { path: 'admin/user-management', component: UserManagementComponent },
  // { path: 'admin/client-management', component: ClientManagementComponent },

  // // Product page
  // { path: 'bugtracker/signup', component: SignupComponent },
  // { path: 'bugtracker/signin', component: SigninComponent },
  // { path: 'bugtracker/sidenav', component: ProductSideNav },
  // { path: 'bugtracker/navbar', component: ProductNavBar },
  // { path: 'bugtracker/dashboard', component: ProductDashboard },
  // { path: 'bugtracker/profile', component: ProfileComponent },
  // { path: 'bugtracker/bugs', component: BugsComponent },
  // { path: 'bugtracker/project', component: ProjectsComponent },
  // { path: 'bugtracker/project/bugs', component: ProjectBugsComponent },
  // { path: 'bugtracker/bug/info', component: BugInfoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

