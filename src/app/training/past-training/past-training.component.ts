import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy  {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  dataSource = new MatTableDataSource<Exercise>();
  private pastExerciseSub: Subscription;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.pastExerciseSub = this.trainingService.pastExercisesChanged.subscribe(
      (pastExercises: Exercise[])=> {
        this.dataSource.data = pastExercises;
        console.log(this.dataSource.data);
    });
    this.trainingService.fetchPastExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: String){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(){
    this.pastExerciseSub.unsubscribe();
  }

}
