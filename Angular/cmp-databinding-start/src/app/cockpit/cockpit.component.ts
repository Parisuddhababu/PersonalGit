import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrl: './cockpit.component.css'
})
export class CockpitComponent {
  @Output() serverCreated =new EventEmitter<{serverName:string, serverContent:string}>();
  @Output('bpCreated') blueprintCreated =new EventEmitter<{serverName:string, serverContent:string}>();
  newServerName = '';
  newServerContent = '';
  onAddServer(serverContent) {
    this.serverCreated.emit({
      serverName:this.newServerName,
      serverContent:this.newServerContent
    })
  }

  onAddBlueprint() {
    this.blueprintCreated.emit({
      serverName:this.newServerName,
      serverContent:this.newServerContent
    })
  }
}
