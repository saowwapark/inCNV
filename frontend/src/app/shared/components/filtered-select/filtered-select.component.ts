import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  Optional,
  Self,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map
} from 'rxjs/operators';
import { filterIncluded } from 'src/app/utils/map.utils';
import {
  ControlValueAccessor,
  FormGroup,
  NgControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-filtered-select',
  templateUrl: './filtered-select.component.html',
  styleUrls: ['./filtered-select.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FilteredSelectComponent
    }
  ],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class FilteredSelectComponent
  implements
    MatFormFieldControl<any>,
    ControlValueAccessor,
    OnInit,
    OnChanges,
    OnDestroy,
    AfterViewInit {
  /****************************** Logic for this component *************************/
  static nextId = 0;
  @Input() options: any[];
  @Input() selectedOption: any;
  @Output() selectionChange = new EventEmitter();
  @ViewChild('input', { static: false })
  // matcher = new MyErrorStateMatcher();
  input: ElementRef;

  filteredOptions: any[];

  /************************************** Property for MatFormFieldControl **********************************/

  filterSelectGroup: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'filtered-select';
  id = `filtered-select-${FilteredSelectComponent.nextId++}`;
  describedBy = '';

  onTouched = () => {};
  get empty() {
    const {
      value: { selectControl }
    } = this.filterSelectGroup;
    return !selectControl;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get label(): string {
    return this._label;
  }
  set label(value: string) {
    this._label = value;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _label: string;

  @Input()
  get appearance(): string {
    return this._appearance;
  }
  set appearance(value: string) {
    this._appearance = value;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _appearance: string;

  @Input()
  get class(): string {
    return this._class;
  }
  set class(value: string) {
    this._class = value;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _class: string;

  @Input()
  get style(): string {
    return this._style;
  }
  set style(value: string) {
    this._style = value;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _style: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled
      ? this.filterSelectGroup.disable()
      : this.filterSelectGroup.enable();
    this.stateChanges.next();
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _disabled = false;

  @Input()
  get value(): any | null {
    const {
      value: { selectControl }
    } = this.filterSelectGroup;
    return selectControl;
  }
  set value(option: any | null) {
    if (option === undefined) {
      option = '';
    }
    this.filterSelectGroup.setValue({ selectControl: option });
    this.stateChanges.next();
  }

  /******************************** Constructor ***************************/
  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.filterSelectGroup = formBuilder.group({
      selectControl: ['']
    });

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'div') {
      this._elementRef.nativeElement.querySelector('div')?.focus();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /*********************** Access Form Conrol ******************/
  onChange = (_: any) => {};
  writeValue(option: any | null): void {
    this.value = option;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /********************** Life Cycle Hook ********************************/
  ngOnChanges() {
    this.filteredOptions = [...this.options];
    if (this.selectedOption !== undefined) {
      this.filterSelectGroup.get('selectControl').setValue(this.selectedOption);
    }
  }
  ngOnInit() {
    if (this._required) {
      this.filterSelectGroup
        .get('selectControl')
        .setValidators(Validators.required);
    }
  }
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith(''),
        map(() => filterIncluded(this.input.nativeElement.value, this.options))
      )
      .subscribe(filteredOptions => {
        this.filteredOptions = filteredOptions;
      });

    this.filterSelectGroup
      .get('selectControl')
      .valueChanges.subscribe(option => {
        this.onChange(option);
      });
  }
  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}
