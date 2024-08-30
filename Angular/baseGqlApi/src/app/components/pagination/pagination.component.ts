import { CommonModule } from '@angular/common';
import { Component ,EventEmitter,Input, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() bannerData: number = 0;
  @Output() pageChanged = new EventEmitter<number>();
  currentPage = 0;
  itemsPerPage = 10;
  paginatedData: number[] = [];

  ngOnChanges() {
    this.updatePaginatedData();
  }

  get totalPages(): number {
    return Math.ceil(this.bannerData / this.itemsPerPage);
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.paginatedData = Array.from({ length: this.itemsPerPage }, (_, i) => startIndex + i + 1)
                              .filter(item => item <= this.bannerData);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.pageChanged.emit(this.currentPage + 1); 
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChanged.emit(this.currentPage + 1);
      this.updatePaginatedData();
    }
  }
}
