import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Firebase
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/product/auth/signup/signup.component';
import { SigninComponent as ProductSigninComponent } from './components/product/auth/signin/signin.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent as AdminSigninComponent } from './components/admin/auth/signin/signin.component';
import { SidenavComponent as AdminSidenav } from './components/admin/sidenav/sidenav.component';
import { DashboardComponent as AdminDashboard } from './components/admin/admin-services/client-management/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent as AdminNavbar } from './components/admin/navbar/navbar.component';
import { UserManagementComponent as AdminUserManagementComponent } from './components/admin/admin-services/user-management/user-management.component';
import { ClientManagementComponent } from './components/admin/admin-services/client-management/client-management.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';
import { SidenavComponent as ProductSideNav } from './components/product/sidenav/sidenav.component';
import { NavbarComponent as ProductNavBar } from './components/product/navbar/navbar.component';
import { ProfileComponent } from './components/product/profile/profile.component';
import { DashboardComponent as ProductDashboard } from './components/product/product-service/dashboard/dashboard.component';
import { BugsComponent } from './components/product/product-service/bugs/bugs.component';
import { ProjectBugsComponent } from './components/product/product-service/project-bugs/project-bugs.component';
import { ProjectsComponent } from './components/product/product-service/projects/projects.component';
import { BugInfoComponent } from './components/product/product-service/bug-info/bug-info.component';
import { AddProjectDialogComponent } from './components/product/product-service/projects/add-project-dialog/add-project-dialog.component';
import { UserManagementComponent as BugTrackerUserManagementComponent } from './components/product/user-management/user-management.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotSupportedComponent } from './components/not-supported/not-supported.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ProductSigninComponent,
    HomeComponent,
    AdminSigninComponent,
    AdminSidenav,
    AdminDashboard,
    AdminNavbar,
    AdminUserManagementComponent,
    ClientManagementComponent,
    AdminProfileComponent,
    ProductSideNav,
    ProfileComponent,
    ProductDashboard,
    BugsComponent,
    ProjectBugsComponent,
    ProductNavBar,
    ProjectsComponent,
    BugInfoComponent,
    AddProjectDialogComponent,
    BugTrackerUserManagementComponent,
    LoaderComponent,
    NotSupportedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
