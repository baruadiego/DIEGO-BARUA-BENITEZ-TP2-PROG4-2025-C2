import { Component, ElementRef, input, output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toggle',
  imports: [],
  templateUrl: './toggle.html',
  styleUrl: './toggle.css',
})
export class Toggle {
  id = input<string>('');
  checked = input<boolean>(false);
  action = output<{action: boolean, id: string}>();

  @ViewChild('toggle', { static: false }) toggle!: ElementRef;

  getId () {
    return 'check-apple' + this.id();
  }

  actionEmiter () {
    this.action.emit({action: !this.toggle.nativeElement.checked, id: this.id()});
  }
}
