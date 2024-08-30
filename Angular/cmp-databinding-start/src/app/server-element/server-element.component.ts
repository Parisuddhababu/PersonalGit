import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrl: './server-element.component.css',
  encapsulation:ViewEncapsulation.Emulated
})
export class ServerElementComponent {
@Input('srvElement') element:{type:string,content:string,name:string}
}
