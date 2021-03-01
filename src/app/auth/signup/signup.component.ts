import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate;
  minDate;
  isLoading = false;
  private loadingSubs: Subscription
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadingSubs = this.authService.loadingStatusChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 16);
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 70);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    })
  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }
}
