import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { EventoSessao } from '../../../core/models/evento-sessao.model';

@Component({
  selector: 'app-chat-clinico',
  standalone: true,
  imports: [],
  templateUrl: './chat-clinico.component.html',
  styleUrl: './chat-clinico.component.scss'
})
export class ChatClinicoComponent implements OnChanges, AfterViewChecked {
  @Input() eventos: EventoSessao[] = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  private deveRolarParaBaixo = false;

  ngOnChanges(): void {
    this.deveRolarParaBaixo = true;
  }

  ngAfterViewChecked(): void {
    if (this.deveRolarParaBaixo) {
      this.rolarParaBaixo();
      this.deveRolarParaBaixo = false;
    }
  }

  private rolarParaBaixo(): void {
    if (this.chatContainer?.nativeElement) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  formatarTempo(segundos: number): string {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  }
}
