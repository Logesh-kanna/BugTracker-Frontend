import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';
import { BugManagementService } from 'src/app/shared/service/product/bug-management/bug-management.service';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.css']
})
export class BugsComponent implements OnInit {
  userToken: String = "";
  displayedColumns: string[] = ['bugId', 'bugName', 'project', 'reporter', 'createdAt', 'assignee', 'dueDate', 'priority', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems: number = 0;
  pageSize: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private storage: LocalStorageService,
    private swalFunc: SweetAlertService,
    private bugManagementService: BugManagementService,
    private router: Router) { }

  ngOnInit(): void {
    const storedData = this.storage.getData("user");
    this.userToken = storedData.data[0] ? storedData.data[0]["token"] : null;
    this.loadUserBugs();
  }

  checkClosed(status: string): boolean {
    return status === "Closed";
  }

  loadUserBugs(page: number = 0, size: number = 10) {
    const data = {
      "assignee_token": this.userToken,
      "page": page,
      "size": size
    }
    this.bugManagementService.showUserBugs(data).subscribe({
      next: (response) => {
        const pageData = response.data[0];
        const contentData = pageData.content.map((item: { token: any; bug_id: any; bug_name: any; project_token: any; project_name: any; reporter_token: any; reporter_name: any; created_date: any; assignee_token: any; assignee_name: any; due_date: any; severity: any; status: any; }, index: number) => ({
          'token': item.token,
          'bugId': item.bug_id,
          'bugName': item.bug_name,
          'projectToken': item.project_token,
          'project': item.project_name,
          'reporterToken': item.reporter_token,
          'reporter': item.reporter_name,
          'createdAt': item.created_date,
          'assigneeToken': item.assignee_token,
          'assignee': item.assignee_name,
          'dueDate': item.due_date,
          'priority': item.severity,
          'status': item.status
        }));
        this.dataSource.data = contentData;
        this.totalItems = pageData.totalElements;
        this.pageSize = pageData.pageable.pageSize;
        if (this.paginator) {
          this.paginator.pageIndex = pageData.pageable.pageNumber;
          this.paginator.pageSize = pageData.pageable.pageSize;
          this.paginator.length = this.totalItems;
        }
      },
      error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    })
  }

  onPageChanged(event: PageEvent) {
    this.loadUserBugs(event.pageIndex, event.pageSize);
  }


  redirectToBugsInfo(token: string) {
    this.storage.setData("bugToken", token);
    this.router.navigate(['bugtracker/bug/info']);
  }

  applyFilter(event: Event) {

  }

}
