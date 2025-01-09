import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  name: string = 'Logesh';
  status: number = 21;
  role: string = 'Admin';
  email: string = 'logesh@gmail.com';
  mobile: string = '7812345670';

  constructor(private storage: LocalStorageService) { }

  ngOnInit(): void {
    this.userData();
  }

  userData() {
    const storedData = this.storage.getData("admin");
    this.name = storedData.data ? storedData.data[0]["name"] : "";
    this.status = storedData.data ? storedData.data[0]["status"] : "";
    this.role = storedData.data ? storedData.data[0]["role"] : "";
    this.email = storedData.data ? storedData.data[0]["email"] : "";
    this.mobile = storedData.data ? storedData.data[0]["mobile"] : "";
  }

}
