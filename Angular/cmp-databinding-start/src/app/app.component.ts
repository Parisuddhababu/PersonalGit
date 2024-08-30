import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (){}
  serverElements = [{type:'server',name:'testServer',content:'just testing the server!'}];
  onServerAdded(serverDta:{serverName:string, serverContent:string}) {
    this.serverElements.push({
      type: 'server',
      name: serverDta.serverName,
      content: serverDta.serverContent
    });
  }

  onBlueprintAdded(blueprintData:{serverName:string, serverContent:string}) {
    this.serverElements.push({
      type: 'blueprint',
      name:blueprintData.serverName,
      content: blueprintData.serverContent
    });
  }
}
