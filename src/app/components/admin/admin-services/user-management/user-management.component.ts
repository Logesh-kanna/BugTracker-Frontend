import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/shared/service/admin/auth/auth.service';
import { UserManagementService } from 'src/app/shared/service/admin/user-management/user-management.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  isAdmin: Boolean = true;

  // Admin
  adminDisplayedColumns: string[] = ['sno', 'name', 'email', 'mobile', 'status'];
  adminDataSource = new MatTableDataSource<any>([]);
  adminTotalItems: number = 0;
  adminPageSize: number = 10;
  // User
  userDisplayedColumns: string[] = ['sno', 'name', 'email', 'mobile', 'status', 'action'];
  userDataSource = new MatTableDataSource<any>([]);
  userTotalItems: number = 0;
  userPageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formData!: FormGroup;
  element: any;

  constructor(private storage: LocalStorageService, private swalFunc: SweetAlertService, private authService: AuthService, private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    const storedData = this.storage.getData("admin");
    const roleCheck = storedData.data[0] ? storedData.data[0]['role'] : null;
    console.log(roleCheck);
    if (roleCheck == "Admin") {
      this.isAdmin = false;
    }
    this.loadAdminTableData();
    this.loadUserTableData();
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')])
    });
  }

  loadAdminTableData(page = 0, size = 10) {
    this.userManagementService.showAdminData(page, size).subscribe({
      next: (response) => {
        if (response.status == "200") {
          const pageData = response.pageData;
          const contentData = pageData.content.map((item: { token: any; name: any; email: any; mobile: any; status: any; }, index: number) => ({
            'token': item.token,
            'sno': index + 1,
            'name': item.name,
            'email': item.email,
            'mobile': item.mobile,
            'status': item.status
          }));
          this.adminDataSource.data = contentData;
          this.adminTotalItems = pageData.totalElements;
          this.adminPageSize = pageData.pageable.pageSize;
          if (this.paginator) {
            this.paginator.pageIndex = pageData.pageable.pageNumber;
            this.paginator.pageSize = pageData.pageable.pageSize;
            this.paginator.length = this.adminTotalItems;
          }
        } else {
          this.swalFunc.showAlert("Failure", response.message, "error");
        }
      },
      error: (error) => {
        this.swalFunc.showAlert("Failure", error.error.message, "error");
      }
    });
  }

  loadUserTableData(page = 0, size = 10) {
    this.userManagementService.showUserData(page, size).subscribe({
      next: (response) => {
        if (response.status == "200") {
          const pageData = response.pageData;
          const contentData = pageData.content.map((item: { token: any; name: any; email: any; mobile: any; status: any; }, index: number) => ({
            'token': item.token,
            'sno': index + 1,
            'name': item.name,
            'email': item.email,
            'mobile': item.mobile,
            'status': item.status
          }));
          this.userDataSource.data = contentData;
          this.userTotalItems = pageData.totalElements;
          this.userPageSize = pageData.totalPages;
          if (this.paginator) {
            this.paginator.pageIndex = pageData.pageable.pageNumber;
            this.paginator.pageSize = pageData.pageable.pageSize;
            this.paginator.length = this.userTotalItems;
          }
        } else {
          this.swalFunc.showAlert("Failure", response.message, "error");
        }
      },
      error: (error) => {
        this.swalFunc.showAlert("Failure", error.error.message, "error");
      }
    });
  }

  onAdminPageChanged(event: PageEvent) {
    this.loadAdminTableData(event.pageIndex, event.pageSize);
  }

  onUserPageChanged(event: PageEvent) {
    this.loadUserTableData(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value.trim;
  }


  addUser() {
    console.log(this.formData.value.name, this.formData.value.age, this.formData.value.role, this.formData.value.email, this.formData.value.mobile);
    if (this.formData.value.name === "" && this.formData.value.age === "" && this.formData.value.role === "" && this.formData.value.email === "" && this.formData.value.mobile === "") {
      this.swalFunc.showAlert('Failed', 'All fields are required', 'warning');
    } else if (this.formData.value.name === "") {
      this.swalFunc.showAlert('Failed', 'Name field is required', 'warning');
    } else if (this.formData.value.age === "") {
      this.swalFunc.showAlert('Failed', 'Age field is required', 'warning');
    } else if (this.formData.value.email === "") {
      this.swalFunc.showAlert('Failed', 'Email field is required', 'warning');
    } else if (this.formData.value.mobile === "") {
      this.swalFunc.showAlert('Failed', 'Mobile field is required', 'warning');
    } else {
      if (this.formData.controls['email'].hasError('email')) {
        this.swalFunc.showAlert('Failed', 'Please enter valid Email Id', 'warning');
      } else
        if (this.formData.controls['mobile'].hasError('pattern')) {
          this.swalFunc.showAlert('Failed', 'Please enter valid mobile number', 'warning');
        } else {
          const data = {
            name: this.formData.value.name,
            email: this.formData.value.email,
            mobile: this.formData.value.mobile
          }
          this.authService.userSignUp(data).subscribe({
            next: (response) => {
              if (response.status == "200") {
                this.swalFunc.showAlert("Succes", response.message, "success").then((res) => {
                  this.closeModal();
                  this.loadUserTableData();
                });
              } else {
                this.swalFunc.showAlert("Failure", response.message, "error");
              }
            },
            error: (error) => {
              this.swalFunc.showAlert("Failure", error.error.message, "error");
            }
          });
        }
    }
  }

  closeModal() {
    this.formData.reset();
  }

  onStatusChange(status: String, token: String) {
    const data = {
      status: status,
      token: token
    };
    this.userManagementService.userChangeStatus(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
          this.loadUserTableData();
        });
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      },
    });
  }

}


