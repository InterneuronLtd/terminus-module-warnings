//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2024  Interneuron Limited

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { AppService } from './app.service';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApirequestService {

  constructor(private httpClient: HttpClient, public authService: AuthenticationService, private appService: AppService) {
  }

  public getRequest(uri: string): Observable<any> {
    if (environment.production) {
      return from(this.appService.apiService.getRequest(uri));
    }
    else
      return from(this.authService.getToken().then((token) => { return this.callApiGet(token, uri); }));
  }

  public postRequest(uri: string, body: any): Observable<any> {
    if (environment.production) {
      return from(this.appService.apiService.postRequest(uri, body));

    }
    else
      return from(this.authService.getToken().then((token) => { return this.callApiPost(token, uri, body); }));
  }

  public deleteRequest(uri: string): Observable<any> {
    if (environment.production) {
      return from(this.appService.apiService.deleteRequest(uri));
    }
    else
      return from(this.authService.getToken().then((token) => { return this.callApiDelete(token, uri) }));
  }


  private callApiGet(token: string, uri: string) {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.httpClient.get(uri, { headers: headers })
      .toPromise()
      .catch((result: HttpErrorResponse) => {
        if (result.status === 401) {

        }
        throw result;
      });
  }

  private callApiPost(token: string, uri: string, body: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    });

    return this.httpClient.post(uri, body, { headers: headers })
      .toPromise()
      .catch((result: HttpErrorResponse) => {
        this.appService.logToConsole(result
        );
        if (result.status === 401) {

        }
        throw result;
      });
  }

  private callApiDelete(token: string, uri: string) {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.httpClient.delete(uri, { headers: headers })
      .toPromise()
      .catch((result: HttpErrorResponse) => {
        if (result.status === 401) {

        }
        throw result;
      });
  }

}
