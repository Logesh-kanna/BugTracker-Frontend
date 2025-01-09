import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { Router } from '@angular/router';
import { ProjectManagementService } from 'src/app/shared/service/product/project-management/project-management.service';
import { AuthService } from 'src/app/shared/service/product/auth/auth.service';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  dialog = inject(MatDialog);
  userToken: String = "";
  isManager: Boolean = false;

  displayedColumns: string[] = ['projectId', 'projectName', 'owner', 'startDate', 'endDate', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems: number = 0;
  pageSize: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formData!: FormGroup;
  users: any[] = [];
  selectedUser: String = "";
  description: any = "";
  projectToken: any = "";

  constructor(private storage: LocalStorageService,
    private swalFunc: SweetAlertService,
    private projectManagementService: ProjectManagementService,
    private router: Router) { }

  ngOnInit(): void {
    const storedData = this.storage.getData("user");
    this.userToken = storedData.data[0] ? storedData.data[0]["token"] : null;
    const checkUser = storedData.data[0] ? storedData.data[0]["role"] : null;
    if (checkUser == "manager") {
      this.isManager = true;
    }
    this.loadProjectData();
    this.formData = new FormGroup({
      "role": new FormControl('', Validators.required),
      "member": new FormControl('', [Validators.required]),
    });
  }

  loadProjectData(page: number = 0, size: number = 10) {
    const data = {
      page: page,
      size: size,
      member_token: this.userToken,
    }
    this.projectManagementService.showUserProject(data).subscribe({
      next: (response) => {
        const pagedata = response.data[0];
        const content = pagedata.content.map((item: {
          description: any; token: any; project_id: any; project_name: any; manager_token: any; manager_name: any; start_date: any; end_date: any;
        }) => ({
          'token': item.token,
          'projectId': item.project_id,
          'projectName': item.project_name,
          'managerToken': item.manager_token,
          'description': item.description,
          'owner': item.manager_name,
          'startDate': item.start_date,
          'endDate': item.end_date
        }));
        this.dataSource.data = content;
        this.totalItems = pagedata.totalElements;
        this.pageSize = pagedata.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pagedata.pageable.pageNumber;
          this.paginator.pageSize = pagedata.pageable.pageSize;
          this.paginator.length = this.totalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  checkOwner(managerToken: string): Boolean {
    if (managerToken == this.userToken) {
      return true;
    } else {
      return false;
    }
  }

  applyFilter(event: Event) {

  }

  onPageChanged(event: PageEvent) {

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '30%',
      panelClass: 'custom-dialog-container',
      data: {
        manager_token: this.userToken
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result : " + result);
      this.loadProjectData();
    });
  }

  redirectToBugs(token: String) {
    this.storage.setData("projectToken", token);
    this.router.navigate(['/bugtracker/project/bugs']);
  }

  onSelectionChange(event: any) {
    if (event.target.value === "manager") {
      this.onManagerClick();
    } else if (event.target.value === "user") {
      this.onUserClick();
    }
  }

  onManagerClick() {
    this.projectManagementService.showManagers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  onUserClick() {
    this.projectManagementService.showUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  openDescriptionModal(description: any) {
    this.description = description;
    const modalId = document.getElementById('descriptionModal');
    const modal = new bootstrap.Modal(modalId);
    modal.show();
  }

  openAddUserModal(projectToken: any) {
    this.projectToken = projectToken;
    const modalId = document.getElementById('addUserModal');
    const modal = new bootstrap.Modal(modalId);
    modal.show();
  }

  closeModal() {
    this.formData.reset();
  }

  addUser(token: string) {
    if (this.formData.value.member == "") {
      this.swalFunc.showAlert("Alert", "Select the member", "warning");
    } else {
      const data = {
        project_token: token,
        member_token: this.formData.value.member,
      };
      this.projectManagementService.addMember(data).subscribe({
        next: (response) => {
          this.swalFunc.showAlert("Success", response.message, "success");
          this.closeModal();
        },
        error: (err) => {
          this.swalFunc.showAlert("Failure", err.error.message, "error");
        }
      });
    }
  }

  deleteProject(projectToken: string) {
    const data = {
      token: projectToken,
    };
    this.projectManagementService.deleteProject(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success");
        this.loadProjectData();
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
        this.loadProjectData();
      }
    });
  }

  deleteUserProject(projectToken: string) {
    const data = {
      project_token: projectToken,
      member_token: this.userToken
    };
    this.projectManagementService.deleteUserProject(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success");
        this.loadProjectData();
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
        this.loadProjectData();
      }
    });
  }

}
