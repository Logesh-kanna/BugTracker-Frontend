import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { ProjectManagementService } from 'src/app/shared/service/product/project-management/project-management.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css'],
})
export class AddProjectDialogComponent implements OnInit {

  formData!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private swalFunc: SweetAlertService,
    private projectManagementService: ProjectManagementService) { }

  ngOnInit(): void {
    this.formData = new FormGroup({
      projectName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    })
  }

  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset the time for correct date comparison
    return date ? date >= currentDate : false; // Disable dates before today
  };


  addProject() {
    if (this.formData.value.projectName == "" && this.formData.value.description == "" && this.formData.value.startDate == "" && this.formData.value.endDate == "") {
      this.swalFunc.showAlert("Failed", "Please enter all the values", "warning")
    } else if (this.formData.value.projectName == "") {
      this.swalFunc.showAlert("Failed", "Please enter the project name", "warning")
    } else if (this.formData.value.description == "") {
      this.swalFunc.showAlert("Failed", "Please enter the description", "warning")
    } else if (this.formData.value.startDate == "") {
      this.swalFunc.showAlert("Failed", "Please select the start date", "warning")
    } else if (this.formData.value.endDate == "") {
      this.swalFunc.showAlert("Failed", "Please select the end date", "warning")
    } else {
      const data = {
        project_name: this.formData.value.projectName,
        description: this.formData.value.description,
        manager_token: this.data.manager_token,
        start_date: this.formData.value.startDate,
        end_date: this.formData.value.endDate,
      };
      this.projectManagementService.createProject(data).subscribe({
        next: (response) => {
          this.swalFunc.showAlert("Success", response.message, "success");
        },
        error: (err) => {
          this.swalFunc.showAlert("Failure", err.error.message, "error");
        }
      })
    }
  }

}
