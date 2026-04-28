import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage';

export interface Question {
  id: number;
  productId: number;
  customerId: string;
  customerName: string;
  questionText: string;
  answerText?: string;
  answeredAt?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private STORAGE_KEY = 'iyabd_qa_db';
  private questions = signal<Question[]>([]);
  private storage = inject(StorageService);

  constructor() {
    this.loadQuestions();
  }

  private loadQuestions() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.questions.set(JSON.parse(saved));
    }
  }

  private saveToStorage(items: Question[]) {
    this.questions.set(items);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  getQuestions() {
    return this.questions;
  }

  getProductQuestions(productId: number, answeredOnly = false) {
    return this.questions().filter(q => q.productId === productId && (!answeredOnly || q.answerText));
  }

  addQuestion(question: Omit<Question, 'id' | 'createdAt'>) {
    const newQuestion: Question = {
      ...question,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.saveToStorage([newQuestion, ...this.questions()]);
    return newQuestion;
  }

  answerQuestion(id: number, answerText: string) {
    const updated = this.questions().map(q => 
      q.id === id ? { ...q, answerText, answeredAt: new Date().toISOString() } : q
    );
    this.saveToStorage(updated);
  }

  deleteQuestion(id: number) {
    this.saveToStorage(this.questions().filter(q => q.id !== id));
  }
}
