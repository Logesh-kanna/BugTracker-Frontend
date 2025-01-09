import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { CloudinarService } from 'src/app/shared/service/common/cloudinary/cloudinar.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { BugManagementService } from 'src/app/shared/service/product/bug-management/bug-management.service';
import { ProjectManagementService } from 'src/app/shared/service/product/project-management/project-management.service';
import { environment } from 'src/environments/environment';
import { ListFormat } from 'typescript';

@Component({
  selector: 'app-project-bugs',
  templateUrl: './project-bugs.component.html',
  styleUrls: ['./project-bugs.component.css']
})
export class ProjectBugsComponent implements OnInit {

  companyName: string = "";
  projectToken: string = "";
  projectName: string = 'HeyCampus';
  userToken: string = "";
  cloudName: string = environment.cloudName;
  uploadPreset: string = environment.uploadPreset;
  users: any[] = [];

  displayedColumns: string[] = ['bugId', 'bugName', 'project', 'Reporter', 'createdAt', 'assignee', 'dueDate', 'priority', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems: number = 0;
  pageSize: number = 0;

  assignees = [{ token: "", name: "None" }];
  severities = [{ token: "", name: "None" }];

  files: { file: File, previewUrl: string }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formData!: FormGroup;

  constructor(private router: Router,
    private location: Location,
    private storage: LocalStorageService,
    private swalFunc: SweetAlertService,
    private cloudinaryService: CloudinarService,
    private projectManagementService: ProjectManagementService,
    private bugManagementService: BugManagementService) { }

  ngOnInit(): void {
    this.formData = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      assignee: new FormControl(''),
      severity: new FormControl(''),
    });
    this.projectToken = this.storage.getData("projectToken");
    const storedData = this.storage.getData("user");
    this.userToken = storedData.data[0] ? storedData.data[0]['token'] : null;
    this.companyName = storedData.data[0] ? storedData.data[0]['company'] : null;
    this.loadBugData();
    this.getUser();
  }

  checkClosed(status: string): boolean {
    return status === "Closed";
  }

  backClick() {
    this.location.back();
  }

  loadBugData(page: number = 0, size: number = 10) {
    const data = {
      page: page,
      size: size,
      project_token: this.projectToken
    }
    this.bugManagementService.showProjectBugs(data).subscribe({
      next: (response) => {
        const parsedData = response.data[0];
        const content = parsedData.content.map((item: { token: any; bug_id: any; bug_name: any; project_token: any; project_name: any; reporter_token: any; reporter_name: any; created_date: any; assignee_token: any; assignee_name: any; due_date: any; severity: any; status: any; }) => ({
          'token': item.token,
          'bugId': item.bug_id,
          'bugName': item.bug_name,
          'projectToken': item.project_token,
          'project': item.project_name,
          'reporterToken': item.reporter_token,
          'Reporter': item.reporter_name,
          'createdAt': item.created_date,
          'assigneeToken': item.assignee_token,
          'assignee': item.assignee_name,
          'dueDate': item.due_date,
          'priority': item.severity,
          'status': item.status
        }));
        this.dataSource.data = content;
        this.totalItems = parsedData.totalElements;
        this.pageSize = parsedData.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = parsedData.pageable.pageIndex;
          this.paginator.pageSize = parsedData.pageable.pageSize;
          this.paginator.length = parsedData.totalElements;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  onPageChanged(event: PageEvent) {
    this.loadBugData(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event) {

  }

  addBug() {
    if (this.formData.value.name == "") {
      this.swalFunc.showAlert("Failed", "Please enter the bug name", "warning");
    } else if (this.formData.value.description == "") {
      this.swalFunc.showAlert("Failed", "Please select the assignee", "warning");
    } else if (this.formData.value.assignee == "") {
      this.swalFunc.showAlert("Failed", "Please select the assignee", "warning");
    } else if (this.formData.value.severity == "") {
      this.swalFunc.showAlert("Failed", "Please select the severity", "warning");
    } else {
      this.uploadImg(this.files, this.companyName, this.projectName).then((uploadedImages) => {
        if (uploadedImages.length > 0) {
          const formData = new FormData();
          const data = {
            bug_name: this.formData.value.name,
            description: this.formData.value.description,
            project_token: this.projectToken,
            reporter_token: this.userToken,
            assignee_token: this.formData.value.assignee,
            status: "Open",
            images: uploadedImages,
            severity: this.formData.value.severity,
          };
          console.log(data);

          // Send the bug data to the backend
          this.bugManagementService.createBug(data).subscribe({
            next: (response) => {
              this.swalFunc.showAlert("Success", response.message, "success");
              this.loadBugData();
              this.closeModal();
              this.files = [];
            },
            error: (err) => {
              this.swalFunc.showAlert("Failure", err.error.message, "error");
            }
          });
        }
      });
    }
  }

  uploadImg(files: { file: File, previewUrl: string }[], companyName: string, projectName: string): Promise<string[]> {
    if (files.length === 0) {
      return Promise.resolve([]);
    }

    const path = `product/${companyName}/${projectName}/`;
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        this.cloudinaryService.uploadFile(file.file, path).subscribe({
          next: (response: any) => {
            resolve(response.secure_url);
          },
          error: (err) => {
            this.swalFunc.showAlert("Failure", "Error occurs while uploading " + file.file.name, "error");
            reject(err);
          }
        });
      });
    });

    return Promise.all(uploadPromises);
  }


  onFilesSelected(event: any): void {
    const selectedFile: FileList = event.target.files;
    console.log("Selected File : " + selectedFile);
    console.log(this.files);
    if (this.files.length <= 2) {
      if (selectedFile.length <= 3) {
        for (let i = 0; i < selectedFile.length; i++) {
          const file = selectedFile[i];
          if (file.type.startsWith('image') || file.type.startsWith('video')) {
            this.createPreview(file);
          } else {
            this.swalFunc.showAlert("Warning", "Only images and videos are allowed.", "warning");
          }
        }
      } else {
        this.swalFunc.showAlert("Warning", "Select only 3 files only", "warning");
      }
    } else {
      this.swalFunc.showAlert("Warning", "Remove any 1 file", "warning");
    }
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.files.push({ file, previewUrl: reader.result as string });
    }
    reader.readAsDataURL(file);
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  closeModal() {
    this.formData.reset();
    this.files = [];
  }

  redirectToBugsInfo(token: string) {
    this.storage.setData("bugToken", token);
    this.router.navigate(['bugtracker/bug/info']);
  }

  // onSelectionChange(event: any) {
  //   if (event.target.value === "manager") {
  //     this.onManagerClick();
  //   } else if (event.target.value === "user") {
  //     this.onUserClick();
  //   }
  // }

  getUser() {
    const data = {
      token: this.projectToken
    }
    this.bugManagementService.projectUsers(data).subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

}
