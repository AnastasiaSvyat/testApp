import { ValidatorFn, FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function checkTime(startDate: string, endDate: string, firstDateField: string, secondDateField: string): ValidatorFn | any {
    return (form: FormGroup): { [key: string]: boolean } | any => {

        const startDateValue = form.get(startDate)?.value;
        const endDateValue = form.get(endDate)?.value;
        const firstTimeValue = form.get(firstDateField)?.value;
        const secondTimeValue = form.get(secondDateField)?.value;

        if (!firstTimeValue || !secondTimeValue) {
            return { missing: true };
        }

        if (moment(startDateValue).format('YYYY-MM-DD') + 'T' + firstTimeValue > moment(endDateValue).format('YYYY-MM-DD') + 'T' + secondTimeValue) {
            const err = { checkTime: true };
            form.get(secondDateField)?.setErrors(err);
            return err;
        } else {
            const timeLessError = form.get(secondDateField)?.hasError('checkTime');
            if (timeLessError) {
                form.get(secondDateField)?.updateValueAndValidity();
            }
        }
    };
}