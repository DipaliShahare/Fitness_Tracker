import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup
  isLoading = false;
  private loadingSubs: Subscription;
  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.loadingSubs = this.authService.loadingStatusChanged.subscribe(isloading => {
      this.isLoading = isloading;
    });
    this.loginForm = new FormGroup({
      email: new FormControl('',{validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]})
    })
  }

  onSubmit(){
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    })
  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }

}
