import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StopTrainingComponent } from '../stop-training/stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: number;
  finished = false;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startTraining();
  }

  startTraining(){
    const step = +this.trainingService.getRunningExercise().duration*1000/100  ;
    this.timer = setInterval(()=>{
      this.progress = this.progress + 5;
      if(this.progress >= 100){
        this.trainingService.completeExercise();
        clearInterval(this.timer);
        this.finished = true;
      }
    }, step);
  }

  onStopTraining(){
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        prog: this.progress
      }
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        this.returnToTraining()
      }
      else {
        this.startTraining();
      }
    })
  }

  returnToTraining() {
    this.trainingService.cancelExercise(this.progress);
  }

}
