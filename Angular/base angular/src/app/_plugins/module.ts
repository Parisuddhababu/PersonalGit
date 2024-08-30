import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeSelectItemComponent } from './components/tree-select-item.component';
import { TreeSelectComponent } from './components/tree-select.component';
import { OffClickDirective } from './directives/off-click.directive';
import { TreeSelectDefaultOptions } from './models/tree-select-default-options';
import { ItemPipe } from './pipes/item.pipe';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TreeSelectComponent, TreeSelectItemComponent, OffClickDirective, ItemPipe],
  exports: [TreeSelectComponent],
})
export class NgxTreeSelectModule {
  public static forRoot(options: TreeSelectDefaultOptions): ModuleWithProviders<NgxTreeSelectModule> {
    return {
      ngModule: NgxTreeSelectModule,
      providers: [{ provide: TreeSelectDefaultOptions, useValue: options }],
    };
  }
}
