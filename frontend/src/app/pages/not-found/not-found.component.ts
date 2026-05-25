import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="centered">
      <h1>Page Not Found!</h1>
      <a class="btn" routerLink="/">Back to shop</a>
    </main>
  `
})
export class NotFoundComponent {}
