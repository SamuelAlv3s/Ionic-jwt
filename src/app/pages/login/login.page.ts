import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private router: Router,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async openRegister() {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.apiService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        await this.modalCtrl.dismiss();
        this.router.navigateByUrl('/inside', { replaceUrl: true });
      },
      async (err) => {
        await loading.dismiss();

        const alert = await this.alert.create({
          header: 'Login Failed',
          message: err.error.msg,
          buttons: ['ok'],
        });

        await alert.present();
      }
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }
}
