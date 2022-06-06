import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const accessToken = localStorage.getItem("bb.accessToken");
        if (accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: accessToken
                }
            });
        }

        return next.handle(request);
    }
}
