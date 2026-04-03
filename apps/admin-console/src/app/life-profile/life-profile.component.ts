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
  villageState: any = null;
  private readonly userId = 'demo-user';

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
    const payload = mapFormToLifeProfile(value, this.userId);

    this.profileService.save(payload).subscribe({
      next: () => {
        this.saved = true;
        if (payload.userId) {
          this.profileService.get(payload.userId).subscribe({
            next: (retrieved) => {
              this.form.patchValue({
                firstName: retrieved.firstName,
                lastName: retrieved.lastName,
                age: retrieved.age,
                preferredRole: retrieved.preferredRole,
              });
            },
            error: () => {
              // ignore retrieval error but keep success state
            },
          });
          this.profileService.getVillageState(payload.userId).subscribe({
            next: (village) => {
              this.villageState = village;
            },
            error: () => {
              // keep existing village state if error
            },
          });
        }
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
