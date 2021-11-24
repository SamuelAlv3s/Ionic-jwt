import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  birthday = null;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: [''],
      bio: [''],
      dateOfBirth: this.fb.group({
        day: [''],
        month: [''],
        year: [''],
      }),
    });
    this.loadUser();
  }

  loadUser() {
    this.apiService.getProfile().subscribe((res: any) => {
      console.log(res);
      this.profileForm.patchValue(res);

      if (res.dateOfBirth && res.dateOfBirth.year !== '') {
        this.birthday = `${res.dateOfBirth.year}-${res.dateOfBirth.month}-${res.dateOfBirth.day}`;
      }
    });
  }

  updateUser() {
    console.log(this.profileForm.value);

    if (this.birthday) {
      const splitted = this.birthday.split('-');

      this.profileForm.patchValue({
        dateOfBirth: {
          day: splitted[2],
          month: splitted[1],
          year: splitted[0],
        },
      });
    }

    this.apiService
      .updateProfile(this.profileForm.value)
      .subscribe(async (res) => {
        this.profileForm.patchValue(res);
        const toast = await this.toastCtrl.create({
          message: 'Profile Saved',
          duration: 2000,
        });
        toast.present();
      });
  }

  deleteAccount() {
    this.apiService
      .deleteAccount()
      .pipe(
        switchMap(async (_) => {
          await this.modalCtrl.dismiss();
          this.apiService.logout();
        })
      )
      .subscribe();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
