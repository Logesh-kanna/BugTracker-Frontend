import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { AuthService } from 'src/app/shared/service/product/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  role: string = "";

  constructor(private route: Router,
    private swalFunc: SweetAlertService,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private storage: LocalStorageService) { }

  ngOnInit(): void {
    const localStorageData = this.authService.isLoggedIn();
    const storedData = this.localStorage.getData('user');
    this.role = storedData.data[0] ? storedData.data[0]['role'] : null;
    if (localStorageData) {
      if (this.role == "admin") {
        this.route.navigate(['/bugtracker/user-management']);
      } else {
        this.route.navigate(['/bugtracker/dashboard']);
      }
    }
  }

  email: string = '';
  password: string = '';
  userType: string = '';

  signin() {
    if (this.email == "" && this.password == "" && this.userType == "") {
      this.swalFunc.showAlert("Failure", "All field are required", "warning");
    } else if (this.email == "") {
      this.swalFunc.showAlert("Failure", "Email field is required", "warning");
    } else if (this.password == "") {
      this.swalFunc.showAlert("Failure", "Password field is required", "warning");
    } else if (this.userType == "") {
      this.swalFunc.showAlert("Failure", "Select the user type", "warning");
    } else {
      const data = {
        "bugtracker_email": this.email,
        "password": this.password
      }
      if (this.userType === "admin") {
        this.authService.adminSignin(data).subscribe({
          next: (response) => {
            const storeData = {
              data: response.data,
              loginTime: new Date().getTime(),
            }
            this.storage.setData("user", storeData);
            this.route.navigate(['/bugtracker/user-management']);
          },
          error: (err) => {
            this.swalFunc.showAlert("Failure", err.error.message, "error");
          }
        })
      }
      if (this.userType === "manager") {
        this.authService.managerSignin(data).subscribe({
          next: (response) => {
            const storeData = {
              data: response.data,
              loginTime: new Date().getTime(),
            }
            this.storage.setData("user", storeData);
            this.route.navigate(['/bugtracker/dashboard']);
          },
          error: (err) => {
            this.swalFunc.showAlert("Failure", err.error.message, "error");
          }
        })
      }
      if (this.userType === "user") {
        this.authService.userSignin(data).subscribe({
          next: (response) => {
            const storeData = {
              data: response.data,
              loginTime: new Date().getTime(),
            }
            this.storage.setData("user", storeData);
            this.route.navigate(['/bugtracker/dashboard']);
          },
          error: (err) => {
            this.swalFunc.showAlert("Failure", err.error.message, "error");
          }
        })
      }
    }
  }

}

