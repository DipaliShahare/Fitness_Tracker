import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService{

  private runningExercise: Exercise;
  private availableExercise: Exercise[] = [];
  exerciseChange = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();
  private fbSubs : Subscription[] = [];
  // = [
  //   {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
  //   {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
  //   {id: 'side-Lunges', name: 'Side Lunges', duration: 120, calories: 18},
  //   {id: 'burpees', name: 'Burpees', duration: 60, calories: 8}
  // ];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises(){
    //return this.availableExercise.slice();
    this.fbSubs.push(this.db
      .collection('availableExercise')
      .snapshotChanges()
      .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories']
          };
        });
      }))
      .subscribe(exercises => {
        this.availableExercise = exercises;
        this.exercisesChanged.next([...this.availableExercise]);
      }));
  }

  getRunningExercise(){
    return {...this.runningExercise};
  }

  fetchPastExercises(){
    //return this.pastExercise.slice();
    this.fbSubs.push(this.db
    .collection('pastExercises')
    .valueChanges()
    .subscribe((pastExercises: Exercise[])=>{
      this.pastExercisesChanged.next(pastExercises);
    }));
  }

  startExercise(selectedId: string){
    this.runningExercise = this.availableExercise.find(ex=> ex.id === selectedId);
    this.exerciseChange.next({...this.runningExercise});
  }

  completeExercise(){
    this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChange.next(null);
  }

  cancelExercise(progress: number){
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress/100),
      calories: this.runningExercise.calories * (progress/100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChange.next(null);
  }

  cancelSubs(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise){
    this.db.collection('pastExercises').add(exercise);
    console.log(exercise);
  }
}
