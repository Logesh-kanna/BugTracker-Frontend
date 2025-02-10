import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { AuthService } from 'src/app/shared/service/product/auth/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userRole: string = "";
  roleCheck: String = "";
  isAdmin: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  hasRoleAccess(role: String) {
    if (role == "admin") {
      return this.userRole === "admin"
    } else if (role === 'manager') {
      return this.userRole === 'admin' || this.userRole === 'manager';
    } else if (role === 'user') {
      return this.userRole === 'admin' || this.userRole === 'manager' || this.userRole === 'user';
    }
    return false;
  }

  // Admin
  adminDisplayedColumns: string[] = ['name', 'email', 'bugTrackerEmail', 'status'];
  adminDataSource = new MatTableDataSource<any>([]);
  adminTotalItems: number = 0;
  adminPageSize: number = 10;
  // Manager
  managerDisplayedColumns: string[] = ['name', 'email', 'bugTrackerEmail', 'status', 'action'];
  managerDataSource = new MatTableDataSource<any>([]);
  managerTotalItems: number = 0;
  managerPageSize: number = 10;
  // User
  userDisplayedColumns: string[] = ['name', 'email', 'bugTrackerEmail', 'status', 'action'];
  userDataSource = new MatTableDataSource<any>([]);
  userTotalItems: number = 0;
  userPageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formData!: FormGroup;
  element: any;

  constructor(private storage: LocalStorageService,
    private swalFunc: SweetAlertService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loadAdminData();
    this.loadManagerData();
    this.loadUserData();
    const storedData = this.storage.getData("user");
    this.roleCheck = storedData.data[0] ? storedData.data[0]['role'] : null;
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  checkManager(): boolean {
    return this.roleCheck === "manager";
  }

  checkManageTabAction(): boolean {
    if (this.roleCheck === "manager" || this.roleCheck === "user") {
      console.log("checkManageTabAction : " + false);
      return true;
    } else {
      console.log("checkManageTabAction : " + true);
      return false;
    }
  }

  checkUser(): boolean {
    if (this.roleCheck == "user") {
      console.log("checkUser : " + false);
      return true;
    } else {
      console.log("checkUser : " + true);
      return false;
    }
  }

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value.trim;
  }

  loadAdminData(page: number = 0, size: number = 10) {
    const data = {
      page: page,
      size: size
    };
    this.authService.adminData(data).subscribe({
      next: (response) => {
        const pagedata = response.pageData;
        const content = pagedata.content.map((item: { token: any; companyName: any; bugTrackerEmail: any; email: any; status: any; }, index: number) => ({
          'sno': index + 1,
          'token': item.token,
          'name': item.companyName,
          'email': item.bugTrackerEmail,
          'bugTrackerEmail': item.email,
          'status': item.status,
        }));
        this.adminDataSource.data = content;
        this.adminTotalItems = pagedata.totalElements;
        this.adminPageSize = pagedata.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pagedata.pageable.pageNumber;
          this.paginator.pageSize = pagedata.pageable.pageSize;
          this.paginator.length = this.adminTotalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  loadManagerData(page: number = 0, size: number = 10) {
    const data = {
      page: page,
      size: size
    };
    this.authService.managerData(data).subscribe({
      next: (response) => {
        const pagedata = response.pageData;
        const content = pagedata.content.map((item: { token: any; name: any; bugTrackerEmail: any; email: any; status: any; }, index: number) => ({
          'sno': index + 1,
          'token': item.token,
          'name': item.name,
          'email': item.bugTrackerEmail,
          'bugTrackerEmail': item.email,
          'status': item.status,
        }));
        this.managerDataSource.data = content;
        this.managerTotalItems = pagedata.totalElements;
        this.managerPageSize = pagedata.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pagedata.pageable.pageNumber;
          this.paginator.pageSize = pagedata.pageable.pageSize;
          this.paginator.length = this.managerTotalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  loadUserData(page: number = 0, size: number = 10) {
    const data = {
      page: page,
      size: size
    };
    this.authService.userData(data).subscribe({
      next: (response) => {
        const pagedata = response.pageData;
        const content = pagedata.content.map((item: { token: any; name: any; bugTrackerEmail: any; email: any; status: any; }, index: number) => ({
          'sno': index + 1,
          'token': item.token,
          'name': item.name,
          'email': item.bugTrackerEmail,
          'bugTrackerEmail': item.email,
          'status': item.status,
        }));
        this.userDataSource.data = content;
        this.userTotalItems = pagedata.totalElements;
        this.userPageSize = pagedata.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pagedata.pageable.pageNumber;
          this.paginator.pageSize = pagedata.pageable.pageSize;
          this.paginator.length = this.userTotalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  addUser() {
    if (this.formData.value.name == "" && this.formData.value.role && this.formData.value.email) {
      this.swalFunc.showAlert("Failure", "All fields are required", "warning");
    } else if (this.formData.value.name == "") {
      this.swalFunc.showAlert("Failure", "Name fields are required", "warning");
    } else if (this.formData.value.role == "") {
      this.swalFunc.showAlert("Failure", "Select the role", "warning");
    } else if (this.formData.value.email == "") {
      this.swalFunc.showAlert("Failure", "Email fields are required", "warning");
    } else if (this.formData.controls['email'].hasError('email')) {
      this.swalFunc.showAlert("Failure", "Invalid Email", "warning");
    } else {
      const data = {
        'name': this.formData.value.name,
        'email': this.formData.value.email,
      }
      if (this.formData.value.role === "manager") {
        this.authService.managerSignup(data).subscribe({
          next: (response) => {
            this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
              if (res.isConfirmed) {
                this.closeModal();
                this.loadAdminData();
                this.loadManagerData();
                this.loadUserData();
              }
            });
          },
          error: (err) => {
            this.swalFunc.showAlert("Failure", err.error.message, "error");
          }
        })
      }
      if (this.formData.value.role === "user") {
        this.authService.userSignup(data).subscribe({
          next: (response) => {
            this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
              if (res.isConfirmed) {
                this.closeModal();
                this.loadAdminData();
                this.loadManagerData();
                this.loadUserData();
              }
            });
          },
          error: (err) => {
            this.swalFunc.showAlert("Failure", err.error.message, "error");
          }
        })
      }
    }
  }

  closeModal() {
    this.formData.reset();
  }

  onAdminPageChanged(event: PageEvent) {
    this.loadAdminData(event.pageIndex, event.pageSize);
  }

  onManagerPageChanged(event: PageEvent) {
    this.loadManagerData(event.pageIndex, event.pageSize);
  }

  onUserPageChanged(event: PageEvent) {
    this.loadUserData(event.pageIndex, event.pageSize);
  }

  deleteManager(token: String) {
    const data = {
      'token': token,
    };
    this.authService.deleteManager(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
          this.loadManagerData();
        });
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  deleteUser(token: String) {
    const data = {
      'token': token,
    };
    this.authService.deleteUser(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
          this.loadUserData();
        });
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }




}
