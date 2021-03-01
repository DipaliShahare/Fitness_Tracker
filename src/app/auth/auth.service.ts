import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from "./auth-data.model";
import { TrainingService } from '../training/training.service';

@Injectable()

export class AuthService {
  private isAuthenticate: boolean = false;
  authChange = new Subject<boolean>();
  loadingStatusChanged = new Subject<boolean>();

  constructor(
    private routes: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar
    ){}

  initAuthListener(){
    this.afAuth.authState.subscribe(
      user => {
        if(user){
          this.isAuthenticate = true;
          this.authChange.next(true);
          this.routes.navigate(['/training']);
        }
        else {
          this.trainingService.cancelSubs();
          this.authChange.next(false);
          this.isAuthenticate = false;
          this.routes.navigate(['/login']);
        }
      }
    );
  }

  registerUser(authData: AuthData){
    // this.user = {
    //   email: authData.email,
    //   userID: Math.round(Math.random()*10000).toString()
    // };
    this.loadingStatusChanged.next(true);
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email,authData.password)
      .then(result => {
        this.loadingStatusChanged.next(false);
      })
      .catch(error => {
        this.loadingStatusChanged.next(false);
        this.snackBar.open(error.message, null, {
          duration: 3000,
          panelClass: 'my-custom-snackbar'
        });
      });
  }

  login(authData: AuthData){
    // this.user = {
    //   email: authData.email,
    //   userID: Math.round(Math.random()*10000).toString()
    // };
    // this.authSuccessfully();
    this.loadingStatusChanged.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.loadingStatusChanged.next(false);
      })
      .catch(error => {
        this.loadingStatusChanged.next(false);
        this.snackBar.open(error.message, null, {
          duration: 3000,
          panelClass: 'my-custom-snackbar'
        });
      });
  }

  logout(){
    this.afAuth.auth.signOut();
  }

  isAuth(){
    return this.isAuthenticate;
  }

}
