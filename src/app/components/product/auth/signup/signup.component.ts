import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientManagementService } from 'src/app/shared/service/admin/client-management/client-management.service';
import { SweetAlertService } from 'src/app/shared/service/common/sweet-alert/sweet-alert.service';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private clientManagementService: ClientManagementService,
    private swalFunc: SweetAlertService) { }

  ngOnInit(): void {
  }

  signup() {
    let contactName = $(".contact_name").val();
    let companyName = $(".company_name").val();
    let companySurname = $(".company_surname").val();
    let mobile = $(".mobile").val();
    let email = $(".email").val();
    let password = $(".password").val();

    if (contactName == "" && companySurname == "" && companyName == "" && mobile == "" && email == "" && password == "") {
      this.swalFunc.showAlert("Failure", "All field are required", "warning");
    } else if (contactName == "") {
      this.swalFunc.showAlert("Failure", "Name field is required", "warning");
    } else if (companyName == "") {
      this.swalFunc.showAlert("Failure", "Company name field is required", "warning");
    } else if (companySurname == "") {
      this.swalFunc.showAlert("Failure", "Company name field is required", "warning");
    } else if (mobile == "") {
      this.swalFunc.showAlert("Failure", "Contact Number field is required", "warning");
    } else if (email == "") {
      this.swalFunc.showAlert("Failure", "Email field is required", "warning");
    } else if (password == "") {
      this.swalFunc.showAlert("Failure", "Password field is required", "warning");
    } else {
      if (!this.isValidEmailAddress(email)) {
        this.swalFunc.showAlert("Failure", "Please enter valid Email Id", "warning");
      }
      if (!this.isValidMobileNumber(mobile)) {
        this.swalFunc.showAlert("Failure", "Please enter valid contact number", "warning");
      }
    }

    const data = {
      'company_name': companyName,
      'company_surname': companySurname,
      'contact_name': contactName,
      'email': email,
      'contact_number': mobile,
      'password': password
    };

    this.clientManagementService.createClient(data).subscribe({
      next: (response) => {
        this.swalFunc.showAlert("Success", "Thank You for SignUp, We will send you a mail after verifing", "success").then((res) => {
          window.location.reload();
        });
      }, error: (err) => {
        this.swalFunc.showAlert("Failure", err.error.message, "error");
      }
    });
  }

  isValidEmailAddress(emailAddress: string) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
  }

  isValidMobileNumber(mobileNumber: string) {
    var mobileNumberPattern = /^[0-9]{10}$/;
    return mobileNumberPattern.test(mobileNumber);
  }

}
