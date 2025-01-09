import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthService } from 'src/app/shared/service/product/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  userName: string = 'Logesh';
  companyName: string = 'AV Groups';
  token: string = "";
  projects: number = 0;
  openBugs: number = 0;
  closedBugs: number = 0;

  public chart: any;

  constructor(private storage: LocalStorageService,
    private authService: AuthService,
    private swalFunc: SweetAlertService) { }

  ngAfterViewInit(): void {
    const storageData = this.storage.getData("user");
    this.token = storageData.data[0]['token'] ? storageData.data[0]['token'] : null;
    this.userName = storageData.data[0]['name'] ? storageData.data[0]['name'] : storageData.data[0]['company_surname'];
    this.companyName = storageData.data[0]['company_name'] ? storageData.data[0]['company_name'] : storageData.data[0]['company'];
    this.loadData();
  }

  loadData() {
    const data = {
      token: this.token,
    };
    this.authService.getDashboardData(data).subscribe({
      next: (response) => {
        this.projects = response.data[0].project;
        this.openBugs = response.data[0].status_open;
        this.closedBugs = response.data[0].status_closed;
        const status1 = response.data[0].status.open;
        const status2 = response.data[0].status.in_progress;
        const status3 = response.data[0].status.to_be_tested;
        const status4 = response.data[0].status.reopen;
        const status5 = response.data[0].status.closed;
        const severity1 = response.data[0].severity.shows_topper;
        const severity2 = response.data[0].severity.critical;
        const severity3 = response.data[0].severity.major;
        const severity4 = response.data[0].severity.minor;
        this.statusChart(status1, status2, status3, status4, status5);
        this.priorityChart(severity1, severity2, severity3, severity4)
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  statusChart(status1: number, status2: number, status3: number, status4: number, status5: number) {
    console.log(status1, status2, status3, status4, status5);
    const ctx = document.getElementById('status') as HTMLCanvasElement;
    const xValues = ["Open", "In Progress", "To be Tested", "Reopened", "Closed"];
    const yValues = [status1, status2, status3, status4, status5];
    const barColors = [
      "#66d9a7",
      "#d9ba66",
      "#667dd9",
      "#73d966",
      "#d96685"
    ];

    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Bug Status"
          }
        },
      }
    });
  }

  priorityChart(severity1: number, severity2: number, severity3: number, severity4: number) {
    const ctx = document.getElementById('priority') as HTMLCanvasElement;
    const xValues = ["Show stopper", "Critical", "Major", "Minor"];
    const yValues = [severity1, severity2, severity3, severity4];
    const barColors = [
      "#cff514",
      "#1a8f3d",
      "#144cf5",
      "#f55014"
    ];

    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Bug Priority"
          }
        },
      }
    });
  }

}
