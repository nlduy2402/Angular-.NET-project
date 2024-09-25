import { Component, OnInit } from '@angular/core';
import { PlayService } from './play.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit {
  messages: string | undefined;
  constructor(public playService: PlayService) {}
  ngOnInit(): void {
    this.playService.getUser().subscribe({
      next:(response: any) => {
      this.messages = response.value.message
    },
      error: errror => console.log(errror)
    });
  }
}
