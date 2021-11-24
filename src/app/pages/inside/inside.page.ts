import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {
  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {}

  logout() {
    this.apiService.logout();
  }

  getSecret() {
    this.apiService.getSecretTest().subscribe((res) => {
      console.log('Secret result: ', res);
    });
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: ProfileComponent,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
  }
}
