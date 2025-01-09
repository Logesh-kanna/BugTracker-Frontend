import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/admin/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentRoute: string = '';
  navName: string = '';
  constructor(private router: Router, private authService: AuthService, private storage: LocalStorageService) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.updateNavBar();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  updateNavBar() {
    if (this.currentRoute === "/admin/dashboard") {
      this.navName = "Dashboard";
    } else if (this.currentRoute === "/admin/user-management") {
      this.navName = "User Management";
    } else if (this.currentRoute === "/admin/client-management") {
      this.navName = "Client Management";
    } else {
      this.navName = "";
    }
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: (Response) => {
          this.storage.removeData("admin");
          console.log(Response);
          this.router.navigate(["/admin/signin"]);
        },
      });
  }

}
