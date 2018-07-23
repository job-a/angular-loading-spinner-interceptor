import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'melding',
  templateUrl: './melding.component.html',
  styleUrls: ['./melding.component.css']
})
export class MeldingComponent implements OnInit {
  @Input() bericht: string;
  @Input() type: string; // voor mogelijke types zie CSS subclasses van dialoog
  @Output() dialoogSluiten: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('alertDialog') dialoogReferentie: ElementRef;

  ngOnInit() {
    this.showModal();
  }

  private showModal(): void {
    if (this.bericht && this.type) {
      this.dialoogReferentie.nativeElement.showModal();
    }
  }

  closeButton(): void {
    if (this.type === 'fout') {
      window.location.reload();
    } else {
      this.closeModal();
    }
  }

  private closeModal(): void {
    this.dialoogReferentie.nativeElement.close();
    this.dialoogSluiten.emit();
    this.dialoogSluiten.complete();
  }

}
