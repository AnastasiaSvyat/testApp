import { ValidatorFn, FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function checkDate(firstDateField: string, secondDateField: string): ValidatorFn | any {
    return (form: FormGroup): { [key: string]: boolean } | any => {

        const firstDateValue = form.get(firstDateField)?.value;
        const secondDateValue = form.get(secondDateField)?.value;

        if (!firstDateValue || !secondDateValue) {
            return { missing: true };
        }

        const firstDate = new Date(moment(firstDateValue).format('YYYY-MM-DD'));
        const secondDate = new Date(moment(secondDateValue).format('YYYY-MM-DD'));

        if (firstDate > secondDate) {
            const err = { checkDate: true };
            form.get(secondDateField)?.setErrors(err);
            return err;
        } else {
            const dateLessError = form.get(secondDateField)?.hasError('checkDate');
            if (dateLessError) {
                form.get(secondDateField)?.updateValueAndValidity();
            }
        }
    };
}