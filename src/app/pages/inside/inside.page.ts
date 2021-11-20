import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  logout() {
    this.apiService.logout();
  }

  getSecret() {
    this.apiService.getSecretTest().subscribe((res) => {
      console.log('Secret result: ', res);
    });
  }
}
