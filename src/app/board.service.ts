import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  selectedPiece = new BehaviorSubject<{ isBlackPiece: boolean, position: number[] }>(null);
  constructor() { }
}
