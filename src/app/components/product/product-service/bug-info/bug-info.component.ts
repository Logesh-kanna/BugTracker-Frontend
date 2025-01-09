import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { BugManagementService } from 'src/app/shared/service/product/bug-management/bug-management.service';

@Component({
  selector: 'app-bug-info',
  templateUrl: './bug-info.component.html',
  styleUrls: ['./bug-info.component.css']
})
export class BugInfoComponent implements OnInit {

  bugToken: string = "";
  bugId: string = "";
  bugName: string = "";
  descriptionForm: string = '';
  projectToken: string = '';
  assigneeToken: string = '';
  reporterToken: string = '';
  img1: string = '';
  img2: string = '';
  img3: string = '';
  assignees = [{ token: "", name: "None" }];
  status = [{ token: "", status: "None" }];

  createdDate: string = '07/05/2023';
  imgCreatorName: string = 'Loge';

  isFullscreen: boolean = false;
  fullscreenImgSrc: string = '';
  userToken: string = "";

  bugInfoForm!: FormGroup;

  constructor(private location: Location,
    private swalFunc: SweetAlertService,
    private storage: LocalStorageService,
    private bugManagementService: BugManagementService) { }

  ngOnInit(): void {
    this.bugToken = this.storage.getData('bugToken');
    const storedData = this.storage.getData("user");
    this.userToken = storedData.data[0] ? storedData.data[0]['token'] : null;
    this.bugInfoForm = new FormGroup({
      reporter: new FormControl(''),
      assignee: new FormControl(''),
      severity: new FormControl(''),
      currentStatus: new FormControl(''),
      createdAt: new FormControl(''),
      dueDate: new FormControl(''),
    });
    this.loadBugData();
  }

  checkImages(): boolean {
    if (this.img1 && this.img2 && this.img3) {
      return true;
    } else {
      return false;
    }
  }

  checkAssignee() {
    if (this.assigneeToken === this.userToken) {
      this.bugInfoForm.get('assignee')?.enable();
      this.bugInfoForm.get('currentStatus')?.enable();
    } else {
      this.bugInfoForm.get('assignee')?.disable();
      this.bugInfoForm.get('currentStatus')?.disable();
    }
  }

  backClick() {
    this.location.back();
  }

  getUser() {
    const data = {
      token: this.projectToken
    }
    this.bugManagementService.projectUsers(data).subscribe({
      next: (response) => {
        this.assignees = response.data;
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  loadBugData() {
    const data = {
      token: this.bugToken,
    }
    this.bugManagementService.showBugInfo(data).subscribe({
      next: (res) => {
        const response = res.data[0];
        this.bugInfoForm.patchValue({
          reporter: response.reporter_name,
          assignee: response.assignee_token,
          severity: response.severity,
          currentStatus: response.status,
          createdAt: response.created_date,
          dueDate: response.due_date,
        });
        this.bugId = response.bug_id;
        this.bugName = response.bug_name;
        this.descriptionForm = response.description;
        this.projectToken = response.project_token;
        this.assigneeToken = response.assignee_token;
        this.reporterToken = response.reporter_token;
        switch (response.imageLength) {
          case 1:
            this.img1 = response.image1;
            break;
          case 2:
            this.img1 = response.image1;
            this.img2 = response.image2;
            break;
          case 3:
            this.img1 = response.image1;
            this.img2 = response.image2;
            this.img3 = response.image3;
            break;
          default:
            break;
        }
        this.getUser();
        this.checkAssignee();
      }, error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  onAssigneeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const data = {
      bug_token: this.bugToken,
      assignee_token: selectedValue
    }
    this.bugManagementService.changeBugAssignee(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success");
        this.loadBugData()
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  onStatusChange(event: any) {
    console.log(event.value);
    const data = {
      bug_token: this.bugToken,
      assignee_token: this.assigneeToken,
      status: event.value
    };
    this.bugManagementService.changeBugStatus(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success");
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }


  isImage(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = url.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension!);
  }

  // Open image in fullscreen mode
  openFullscreen(mediaSrc: string, event: MouseEvent) {
    this.isFullscreen = true;
    this.fullscreenImgSrc = mediaSrc;
    const clickedElement = event.target as HTMLElement;
    if (clickedElement instanceof HTMLVideoElement) {
      this.openMediaInFullscreen(clickedElement);
    } else {
      console.log("Clicked element is not a video!");
    }
  }

  openMediaInFullscreen(mediaElement: HTMLVideoElement | HTMLElement) {
    // Type assertion for older browsers
    if ((mediaElement as any).requestFullscreen()) {
      (mediaElement as HTMLElement).requestFullscreen().catch((err) => console.log("Error opening video fullscreen: ", err));
    } else if ((mediaElement as any).msRequestFullscreen) {  // For legacy IE/Edge
      (mediaElement as any).msRequestFullscreen().catch((err: any) => console.log("Error opening video fullscreen: ", err));
    } else if ((mediaElement as any).mozRequestFullScreen) { // For Firefox
      (mediaElement as any).mozRequestFullScreen().catch((err: any) => console.log("Error opening video fullscreen: ", err));
    } else if ((mediaElement as any).webkitRequestFullscreen) { // For Chrome, Safari, Opera
      (mediaElement as any).webkitRequestFullscreen().catch((err: any) => console.log("Error opening video fullscreen: ", err));
    } else {
      console.log("Fullscreen is not supported by this browser.");
    }
  }

  closeFullscreen() {
    this.isFullscreen = false;
    this.fullscreenImgSrc = '';
  }

}
