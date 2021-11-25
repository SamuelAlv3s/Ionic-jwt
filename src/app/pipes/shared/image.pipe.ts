import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  constructor(private httpClient: HttpClient) {}

  transform(url: string) {
    console.log('url: ', url);

    return this.httpClient.get(url, { responseType: 'blob' }).pipe(
      switchMap((blob) => {
        return Observable.create((observer) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            observer.next(reader.result);
          };
        });
      })
    );
  }
}
