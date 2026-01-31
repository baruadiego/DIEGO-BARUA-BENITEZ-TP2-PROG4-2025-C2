import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-toggle',
  imports: [NgClass],
  templateUrl: './toggle.html',
  styleUrl: './toggle.css',
})
export class Toggle {
  id = input<string>('');
  checked = input<boolean>(false);
  action = output<{action: boolean, id: string}>();
  disabled = input<boolean>(false);

  @ViewChild('toggle', { static: false }) toggle!: ElementRef;

  getId () {
    return 'check-apple' + this.id();
  }

  actionEmiter () {
    this.action.emit({action: !this.toggle.nativeElement.checked, id: this.id()});
  }
}
