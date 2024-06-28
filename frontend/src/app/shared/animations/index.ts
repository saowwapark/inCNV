import {
  trigger,
  animate,
  style,
  transition,
  state
} from '@angular/animations';

export const myAnimations = [
  trigger('slideInOut', [
    state(
      '0',
      style({
        height: '0px',
        display: 'none'
      })
    ),
    state(
      '1',
      style({
        height: '*',
        display: 'block'
      })
    ),
    transition('1 => 0', animate('300ms ease-out')),
    transition('0 => 1', animate('300ms ease-in'))
  ]),
  trigger('slideInTop', [
    state(
      'void',
      style({
        transform: 'translateY(-100%)',
        display: 'none'
      })
    ),
    state(
      '*',
      style({
        transform: 'translateY(0)',
        display: 'flex'
      })
    ),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ])
];
