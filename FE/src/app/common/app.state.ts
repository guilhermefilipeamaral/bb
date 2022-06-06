import { Injectable } from "@angular/core";

@Injectable()
export class ApplicationState {

  get expiresAt(): any | null {
    return localStorage.getItem("bb.expiresAt") || "";
  }

  set expiresAt(date: string | null) {
    if (!date) {
      localStorage.removeItem("bb.expiresAt");
    } else {
      localStorage.setItem("bb.expiresAt", date);
    }
  }

  get accessToken(): string | null {
    return localStorage.getItem("bb.accessToken") || "";
  }

  set accessToken(token: string | null) {
    if (!token) {
      localStorage.removeItem("bb.accessToken");
    } else {
      localStorage.setItem("bb.accessToken", token);
    }
  }

  get firstName(): any | null {
    return localStorage.getItem("bb.firstName") || "";
  }

  set firstName(name: string | null) {
    if (!name) {
      localStorage.removeItem("bb.firstName");
    } else {
      localStorage.setItem("bb.firstName", name);
    }
  }

  get lastName(): string | null {
    return localStorage.getItem("bb.lastName") || "";
  }

  set lastName(name: string | null) {
    if (!name) {
      localStorage.removeItem("bb.lastName");
    } else {
      localStorage.setItem("bb.lastName", name);
    }
  }

  get storeId(): number | null {
    return Number(localStorage.getItem("bb.storeId"));
  }

  set storeId(name: number | null) {
    if (!name) {
      localStorage.removeItem("bb.storeId");
    } else {
      localStorage.setItem("bb.storeId", name.toString());
    }
  }

  private role: string;
}
