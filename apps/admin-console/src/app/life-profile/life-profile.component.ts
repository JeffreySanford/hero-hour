import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LifeProfileService } from './life-profile.service';
import { mapFormToLifeProfile, LifeProfileFormValue } from './life-profile.mapper';

@Component({
  standalone: false,
  selector: 'app-life-profile',
  template: `
    <h2>Life Profile</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        First name
        <input formControlName="firstName" />
      </label>

      <label>
        Last name
        <input formControlName="lastName" />
      </label>

      <label>
        Age
        <input type="number" formControlName="age" />
      </label>

      <label>
        Role
        <select formControlName="preferredRole">
          <option value="leader">Leader</option>
          <option value="member">Member</option>
          <option value="observer">Observer</option>
        </select>
      </label>

      <button type="submit">Save</button>
    </form>

    <div *ngIf="saved" class="success">Saved</div>
    <div *ngIf="error" class="error">Failed to save</div>
  `,
})
export class LifeProfileComponent {
  form: FormGroup;
  saved = false;
  error = false;

  constructor(private fb: FormBuilder, private profileService: LifeProfileService) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      preferredRole: ['member', Validators.required],
    });
  }

  onSubmit(): void {
    this.error = false;
    this.saved = false;

    if (this.form.invalid) {
      return;
    }

    const value = this.form.value as LifeProfileFormValue;
    const payload = mapFormToLifeProfile(value);

    this.profileService.save(payload).subscribe({
      next: () => {
        this.saved = true;
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
