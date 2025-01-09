import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientManagementService } from 'src/app/shared/service/admin/client-management/client-management.service';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  isAdmin: Boolean = true;

  // Active
  activeDisplayedColumns = ['sno', 'contact_name', 'company_name', 'contact_number', 'email', 'surname', 'status', 'action'];
  activeDataSource = new MatTableDataSource<any>([]);
  activeTotalItems: number = 0;
  activePageSize: number = 10;

  // Rejected
  rejectedDisplayedColumns = ['sno', 'contact_name', 'company_name', 'contact_number', 'email', 'surname', 'action'];
  rejectedDataSource = new MatTableDataSource<any>([]);
  rejectedTotalItems: number = 0;
  rejectedPageSize: number = 10;

  // Requested
  requestedDisplayedColumns = ['sno', 'contact_name', 'company_name', 'contact_number', 'email', 'surname', 'action'];
  requestedDataSource = new MatTableDataSource<any>([]);
  requestedTotalItems: number = 0;
  requestedPageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) sort!: MatSort;

  constructor(private clientManagementService: ClientManagementService,
    private storage: LocalStorageService,
    private swalFunc: SweetAlertService) { }

  ngOnInit(): void {
    const storedData = this.storage.getData("admin");
    const roleCheck = storedData.data[0] ? storedData.data[0]['role'] : null;
    console.log(roleCheck);
    if (roleCheck == "Admin") {
      this.isAdmin = false;
    }
    this.loadActiveData();
    this.loadRejectedData();
    this.loadRequestedData();
  }

  loadActiveData(page = 0, size = 10) {
    const data = {
      page: page,
      size: size
    };
    this.clientManagementService.showAcceptedOrDisabledClients(data).subscribe({
      next: (response) => {
        const pageData = response.pageData;
        console.log(pageData.content);
        const contentData = pageData.content.map((item: {
          companySurname: any; status: any; email: any; number: any; companyName: any; token: any; contactName: any;
        }, index: number) => ({
          'sno': index + 1,
          'token': item.token,
          'contact_name': item.contactName,
          'company_name': item.companyName,
          'contact_number': item.number,
          'email': item.email,
          'status': item.status,
          'surname': item.companySurname,
        }));
        this.activeDataSource.data = contentData;
        this.activeTotalItems = pageData.totalElements;
        this.activePageSize = pageData.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pageData.pageable.pageNumber;
          this.paginator.pageSize = pageData.pageable.pageSize;
          this.paginator.length = this.activeTotalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  loadRejectedData(page = 0, size = 10) {
    const data = {
      page: page,
      size: size
    };
    this.clientManagementService.showRejectedClients(data).subscribe({
      next: (response) => {
        const pageData = response.pageData;
        console.log(pageData.content);
        const contentData = pageData.content.map((item: {
          companySurname: any; status: any; email: any; number: any; companyName: any; token: any; contactName: any;
        }, index: number) => ({
          'sno': index + 1,
          'token': item.token,
          'contact_name': item.contactName,
          'company_name': item.companyName,
          'contact_number': item.number,
          'email': item.email,
          'surname': item.companySurname,
        }));
        this.rejectedDataSource.data = contentData;
        this.rejectedTotalItems = pageData.totalElements;
        this.rejectedPageSize = pageData.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pageData.pageable.pageNumber;
          this.paginator.pageSize = pageData.pageable.pageSize;
          this.paginator.length = this.rejectedTotalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  loadRequestedData(page = 0, size = 10) {
    const data = {
      page: page,
      size: size
    };
    this.clientManagementService.showRequestedClients(data).subscribe({
      next: (response) => {
        const pageData = response.pageData;
        console.log(pageData);
        const contentData = pageData.content.map((item: {
          companySurname: any; status: any; email: any; number: any; companyName: any; token: any; contactName: any;
        }, index: number) => ({
          'sno': index + 1,
          'token': item.token,
          'contact_name': item.contactName,
          'company_name': item.companyName,
          'contact_number': item.number,
          'email': item.email,
          'surname': item.companySurname,
        }));
        this.requestedDataSource.data = contentData;
        this.requestedTotalItems = pageData.totalElements;
        this.requestedPageSize = pageData.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pageData.pageable.pageNumber;
          this.paginator.pageSize = pageData.pageable.pageSize;
          this.paginator.length = this.requestedTotalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  applyFilter(event: Event) {

  }

  onActivePageChanged(event: PageEvent) {
    this.loadActiveData(event.pageIndex, event.pageSize);
  }

  onRejectedPageChanged(event: PageEvent) {
    this.loadRejectedData(event.pageIndex, event.pageSize);
  }

  onRequestedPageChanged(event: PageEvent) {
    this.loadRejectedData(event.pageIndex, event.pageSize);
  }

  onStausChange(status: String, token: String) {
    const data = {
      status: status,
      token: token
    };
    if (status == "Delete") {
      this.clientManagementService.deleteClient(data).subscribe({
        next: (response) => {
          this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
            this.loadActiveData();
            this.loadRejectedData();
            this.loadRequestedData();
          });
        },
        error: (err) => {
          this.swalFunc.showAlert("Failure", err.error.message, "error");
        }
      });
    } else {
      this.clientManagementService.changeStatus(data).subscribe({
        next: (response) => {
          this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
            this.loadActiveData();
            this.loadRejectedData();
            this.loadRequestedData();
          });
        },
        error: (err) => {
          this.swalFunc.showAlert("Failure", err.error.message, "error");
        }
      });
    }
  }

  acceptRequest(status: String, token: String) {
    const data = {
      status: status,
      token: token
    };
    this.clientManagementService.acceptRequest(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
          this.loadActiveData();
          this.loadRejectedData();
          this.loadRequestedData();
        });
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  deleteClient(token: String) {
    const data = {
      token: token
    }
    this.clientManagementService.deleteClient(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", response.message, "success").then((res) => {
          this.loadActiveData();
          this.loadRejectedData();
          this.loadRequestedData();
        });
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

}
