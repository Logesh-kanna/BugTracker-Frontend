import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/admin/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';

declare var $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  userType: string = '';
  loader: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private swalFunc: SweetAlertService,
    private storage: LocalStorageService) { }

  ngOnInit(): void {
    const localStorageData = this.authService.isLoggedIn();
    if (localStorageData) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async loaderFunc() {
    await this.delay(3000);
    this.router.navigate(['/admin/dashboard']);
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  signin() {
    let email = $(".email").val();
    let password = $(".password").val();
    let type = this.userType;

    if (email == "" && password == "" && type == "") {
      this.swalFunc.showAlert("Failure", "All field are required", "warning");
    } else if (email == "") {
      this.swalFunc.showAlert("Failure", "Email field is required", "warning");
    } else if (password == "") {
      this.swalFunc.showAlert("Failure", "Password field is required", "warning");
    } else if (type == "") {
      this.swalFunc.showAlert("Failure", "Select the user type", "warning");
    }

    const data = {
      "email": email,
      "password": password
    }
    if (type === "admin") {
      this.authService.adminSignIn(data).subscribe({
        next: (response) => {
          this.loader = true;
          const userData = {
            data: response.data,
            loginTime: new Date().getTime()
          };
          this.storage.setData("admin", userData);
          this.loaderFunc();
          console.log(userData);
        },
        error: (error) => {
          this.swalFunc.showAlert("Failure", error.error.message, "error").then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/admin/signin']);
            }
          });
        }
      });
    }
    if (type === "user") {
      this.authService.userSignIn(data).subscribe({
        next: (response) => {
          const userData = {
            data: response.data,
            loginTime: new Date().getTime()
          };
          this.loader = true;
          this.storage.setData("admin", userData);
          this.loaderFunc();
        }, error: (error) => {
          console.log("error" + error.error.message);
          this.swalFunc.showAlert("Failure", error.error.message, "error").then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/admin/signin']); // Or your desired route
            }
          });
        }
      });
    }
  }
}
