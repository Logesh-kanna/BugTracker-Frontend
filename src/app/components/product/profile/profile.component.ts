import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string = 'Logesh';
  companyName: string = 'AV Groups';
  bugtrackerEmail: string = 'logesh@avgroups.com';
  role: string = 'Admin';
  email: string = 'logesh@gmail.com';
  status: string = '7812345670';

  constructor(private storage: LocalStorageService) { }

  ngOnInit(): void {
    const storageData = this.storage.getData("user");
    console.log(storageData.data[0] ? storageData.data[0]['company_surname'] : storageData.data[0]['name']);
    this.name = storageData.data[0]['company_surname'] ? storageData.data[0]['company_surname'] : storageData.data[0]['name'];
    this.companyName = storageData.data[0]['company_name'] ? storageData.data[0]['company_name'] : storageData.data[0]['company'];
    this.bugtrackerEmail = storageData.data[0] ? storageData.data[0]['bugtracker_email'] : null;
    this.role = storageData.data[0] ? storageData.data[0]['role'] : null;
    this.email = storageData.data[0] ? storageData.data[0]['email'] : null;
    this.status = storageData.data[0] ? storageData.data[0]['status'] : null;
  }

}
