import { AbstractControl, FormControl, FormGroup, FormArray, ValidationErrors } from '@angular/forms';
import { isBlank, isPresent } from './logic.utils';

// Return a copied AbstractControl
export const copyAbstractControl = (abstractControl: AbstractControl): AbstractControl => {
  if (abstractControl instanceof FormControl) {
      return new FormControl(abstractControl.value);
  } else if (abstractControl instanceof FormGroup) {
      const copy = new FormGroup({});
      Object.keys(abstractControl.getRawValue()).forEach(key => {
          copy.addControl(key, copyAbstractControl(abstractControl.controls[key]));
      });
      return copy;
  } else if (abstractControl instanceof FormArray) {
      const copy = new FormArray([]);
      abstractControl.controls.forEach(control => {
          copy.push(copyAbstractControl(control));
      });
      return copy;
  }
};

// If errorObj is null, crate a new error. If error isn't null, add a new error to errorObj
export function addErrorToControl(currControl: AbstractControl, errorKey: string ) {
  const errorObj: ValidationErrors = { [errorKey] : true };
  const currError: ValidationErrors = currControl.errors;
  let newErrors: ValidationErrors = currError;
  if (isBlank(currError)) {
    newErrors = errorObj;
  } else if (isBlank(currError[errorKey])) {
    newErrors = Object.assign(currError, errorObj);
  }
   // Add specific errors based on condition
   currControl.setErrors(newErrors);
}

/**
 * If there is errorKey, delet it.
 * If after deleting errorKey, the currError is empty, set currError to undefined/null
 * @param currError f
 * @param errorKey f
 */
export function removeErrorFromControl(currControl, errorKey: string) {
  const currError = currControl.errors;
  let newErrors = currError;
  // if there is errorKey, delete that error Obj.
  if (isPresent(newErrors)) {
    delete newErrors[errorKey];
    // if don't have any error, set {} to undefined/null
    if (isBlank(newErrors)) {
      newErrors = null;
    }
  }
   // Add specific errors based on condition
   currControl.setErrors(newErrors);
}

export function formGroup2Controls(formGroup: FormGroup): AbstractControl[] {
  const controls: AbstractControl[] = [];
  Object.keys(formGroup.controls).forEach(key => {
    controls.push(formGroup.get(key));
  });
  return controls;
}

export function getControls (formArray: FormArray, field: string): AbstractControl[] {
  const controls: AbstractControl[] = [];
  formArray.controls.forEach(control => {
    if (isPresent(control.get(field).value)) {
      controls.push(control.get(field));
    }
  });
  return controls;
}

export function getControlsHasValue (controls: AbstractControl[]): AbstractControl[] {
  const controlsHasValue = controls.filter(
    (formControl: FormControl) => {
      return isPresent(formControl.value);
    });
  return controlsHasValue;
}

export const returnErrorKey = (find: boolean, errorKey): ValidationErrors => {
  if (find) {
    return { [errorKey] : true };
  } else {
    return null;
  }
};




