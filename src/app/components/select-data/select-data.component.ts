import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { checkDate } from 'src/app/validators/datepicker.validator';
import { checkTime } from 'src/app/validators/time.validator';
import { ShowResultComponent } from './show-result/show-result.component';

interface TimeList {
  date: string;
  time: string;
}

@Component({
  selector: 'app-select-data',
  templateUrl: './select-data.component.html',
  styleUrls: ['./select-data.component.css']
})
export class SelectDataComponent implements OnInit {

  timeList: TimeList[] = [];

  form!: FormGroup;

  today: string = moment().format()
  getTime = new Date().getTime();
  startTime!: string;
  endTime!: string;
  public myControl = new FormControl();

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,

  ) { }

  ngOnInit(): void {
    this.getTimeStops('00:00', '23:45');

    this.getTimeNow()
    this.form = new FormGroup({
      startDate: new FormControl(this.today),
      startTimeSelect: new FormControl(this.startTime),
      endDate: new FormControl(this.today),
      endTimeSelect: new FormControl(this.endTime,),
    }, {
      validators:
        [
          checkDate('startDate', 'endDate'),
          checkTime('startDate', 'endDate', 'startTimeSelect', 'endTimeSelect')
        ]
    })
  }

  get startDate() { return this.form.get('startDate'); }
  get startTimeSelect() { return this.form.get('startTimeSelect'); }
  get endDate() { return this.form.get('endDate'); }
  get endTimeSelect() { return this.form.get('endTimeSelect'); }

  getTimeStops(start: string, end: string) {
    let startTime = moment(start, 'HH:mm');
    let endTime = moment(end, 'HH:mm');

    while (startTime <= endTime) {
      this.timeList.push({
        date: moment(this.form?.value.startDate).format('YYYY-MM-DD') + 'T' + moment(startTime).format('HH:mm'),
        time: moment(startTime).format('HH:mm')
      });
      startTime.add(15, 'minutes');
    }
    return this.timeList;
  }


  getTimeNow() {
    const interval = 15 * 60 * 1000
    this.startTime = moment(Math.ceil(this.getTime / interval) * interval).format('HH:mm')
    this.endTime = moment(Math.ceil(this.getTime / interval) * interval).add(1, 'hour').format('HH:mm')
  }

  selectTime(event: MatOptionSelectionChange, time: TimeList) {
    if (event.isUserInput) {
      this.endTimeSelect?.setValue(moment(time.date).add(1, 'hour').format('HH:mm'))
      this.endDate?.setValue(moment(time.date).add(1, 'hour').format())
    }
  }

  onDateChange(event: any) {
    this.timeList = [];
    this.getTimeStops('00:00', '23:45');
    this.endDate?.setValue(event.value)
  }

  submit() {
    const dialogRef = this.dialog.open(ShowResultComponent, {
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      disableClose: true,
      panelClass: 'icon-outside',
      data: { startDate: moment(this.form?.value.startDate).format('YYYY-MM-DD') + 'T' + this.form?.value.startTimeSelect, endDate: moment(this.form?.value.endDate).format('YYYY-MM-DD') + 'T' + this.form?.value.endTimeSelect }
    });
  }

}
