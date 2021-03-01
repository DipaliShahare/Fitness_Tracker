import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import  'rxjs/add/operator/map';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  private exerciseSub: Subscription;

  constructor(private trainingService: TrainingService,) { }

  ngOnInit(): void {
    //this.exercises = this.trainingService.getAvailableExercises();
    this.exerciseSub = this.trainingService.exercisesChanged.subscribe( (exe: Exercise[]) => {
      this.exercises = exe;
    })
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }

}

