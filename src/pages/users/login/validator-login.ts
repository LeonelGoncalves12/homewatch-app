import { FormControl } from '@angular/forms';
import { Component } from "@angular/core";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class ValidatorLoginPage {
  static isValid(control: FormControl): any {

    if (isNaN(control.value)) {
      return {
        "not a number": true
      };
    }

    if (control.value % 1 !== 0) {
      return {
        "not a whole number": true
      };
    }

    if (control.value < 18) {
      return {
        "too young": true
      };
    }

    if (control.value > 120) {
      return {
        "not realistic": true
      };
    }

    return null;
  }
}
