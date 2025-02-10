import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/admin/auth/auth.service';
import { ClientManagementService } from 'src/app/shared/service/admin/client-management/client-management.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  public chart: any;

  userName: string = "";
  role: string = "";
  accepted: number = 0;
  requested: number = 0;
  rejected: number = 0;


  constructor(private authService: AuthService,
    private swalFunc: SweetAlertService,
    private storage: LocalStorageService) { }

  ngOnInit() {
    const storedData = this.storage.getData("admin");
    this.userName = storedData.data[0] ? storedData.data[0]['name'] : "";
    this.role = storedData.data[0] ? storedData.data[0]['role'] : "";
    this.loadData();
  }


  async loadData() {
    await this.authService.getDashboardData().subscribe({
      next: (response) => {
        this.accepted = response.data[0].accepted;
        this.requested = response.data[0].requested
        this.rejected = response.data[0].rejected;
        console.log(this.accepted);
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  // ngAfterViewInit(): void {
  //   this.linearChart();
  //   this.barchart();
  // }

  // linearChart() {
  //   const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  //   const xValues = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];
  //   this.chart = new Chart(ctx, {
  //     type: 'line', // Specify the type of chart
  //     data: {
  //       labels: xValues, // X-axis labels
  //       datasets: [{
  //         label: 'Request',
  //         data: yValues,
  //         borderColor: '#007bff', // Bootstrap primary color
  //         fill: false
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         x: {
  //           display: true,
  //           title: {
  //             display: true,
  //             text: 'Months'
  //           }
  //         },
  //         y: {
  //           display: true,
  //           title: {
  //             display: true,
  //             text: 'Value'
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  // barchart() {
  //   const ctx = document.getElementById('barchart') as HTMLCanvasElement;
  //   var xValues = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   var yValues = [55, 49, 44, 24, 15];

  //   new Chart(ctx, {
  //     type: "bar",
  //     data: {
  //       labels: xValues,
  //       datasets: [{
  //         label: "Number of Companies",
  //         backgroundColor: "blue",
  //         data: yValues
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         x: {
  //           display: true,
  //           title: {
  //             display: true,
  //             text: 'Months'
  //           }
  //         },
  //         y: {
  //           display: true,
  //           title: {
  //             display: true,
  //             text: 'No of companies'
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

}
