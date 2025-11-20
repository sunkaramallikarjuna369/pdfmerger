import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  apiUrl = 'https://app-wgilsneh.fly.dev';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  mergePDFs() {
    if (this.selectedFiles.length < 2) {
      this.errorMessage = 'Please select at least 2 PDF files to merge';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.http.post(`${this.apiUrl}/merge-pdfs`, formData, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.successMessage = 'PDFs merged successfully!';
        this.isLoading = false;
        this.selectedFiles = [];
      },
      error: (error) => {
        this.errorMessage = 'Error merging PDFs: ' + (error.error?.detail || error.message);
        this.isLoading = false;
      }
    });
  }
}
