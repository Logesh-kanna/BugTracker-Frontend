import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { AuthService } from 'src/app/shared/service/product/auth/auth.service';

@Component({
  selector: 'app-navbar-bugtracker',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentRoute: string = '';
  navName: string = '';
  isUserPage: Boolean = true;
  constructor(private router: Router,
    private authService: AuthService,
    private swalFunc: SweetAlertService) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.updateNavBar();
    if (this.currentRoute === "/bugtracker/user-management") {
      this.isUserPage = false;
    }
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  updateNavBar() {
    if (this.currentRoute === "/bugtracker/dashboard") {
      this.navName = "Dashboard";
    } else if (this.currentRoute === "/bugtracker/bugs") {
      this.navName = "Bugs";
    } else if (this.currentRoute === "/bugtracker/project") {
      this.navName = "Projects";
    } else if (this.currentRoute === "/bugtracker/project/bugs") {
      this.navName = "Project Bugs";
    } else if (this.currentRoute === "/bugtracker/bug/info") {
      this.navName = "Bug Details";
    } else if (this.currentRoute === "/bugtracker/user-management") {
      this.navName = "Users";
    } else {
      this.navName = "";
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.router.navigate(["/bugtracker/signin"]);
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }
}
