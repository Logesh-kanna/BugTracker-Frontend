import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';

@Component({
  selector: 'app-sidenav-bugtracker',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  currentRoute: string = '';
  role: string = "";
  constructor(private router: Router, private storage: LocalStorageService) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    const storedData = this.storage.getData('user');
    this.role = storedData.data[0] ? storedData.data[0]['role'] : null;
  }

  checkAdmin(): boolean {
    if (this.role == "admin") {
      return false;
    }
    return true;
  }

  isActive(route: string): boolean {
    if (this.currentRoute === '/bugtracker/project/bugs') {
      return route === "/bugtracker/project";
    }
    return this.currentRoute === route;
  }

}
