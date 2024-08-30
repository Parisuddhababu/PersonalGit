import { Component } from '@angular/core';
import { OpenaiService } from './openai.service';

export class TextResponse {
  sno:number=1;
  text:string='';
  response:any='';
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'openai-app';


  textList:TextResponse[]=[{sno:1,text:'',response:''}];

  constructor(private openaiService: OpenaiService) {}

  generateText(data:TextResponse) {
    this.openaiService.generateText(data.text).then(text => {
      data.response = text;
      if(this.textList.length===data.sno){
        this.textList.push({sno:1,text:'',response:''});
      }
    });
  }

}
