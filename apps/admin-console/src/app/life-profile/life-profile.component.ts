import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LifeProfileService } from './life-profile.service';
import { mapFormToLifeProfile, LifeProfileFormValue } from './life-profile.mapper';

@Component({
  standalone: false,
  selector: 'app-life-profile',
  templateUrl: './life-profile.component.html',
  styleUrls: ['./life-profile.component.scss'],
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
