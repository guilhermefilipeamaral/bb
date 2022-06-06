
import { Injectable } from "@angular/core";
import { ApplicationState } from "../common/app.state";

@Injectable({providedIn: "root"})
export class HasPermissionService {
  private readonly And = "AND";
  private readonly Or = "OR";
  private logicalOperation: string | undefined;

  constructor(private appState: ApplicationState) {}

  public checkPermission(permissions: string[], operation?: string): boolean {
    let hasPermission = false;
    this.logicalOperation = operation ? operation : this.And;

    /* if (this.appState && this.appState.role && this.appState.userData.permissions) {
      for (const checkPermission of permissions) {
        const permissionFound = this.appState.userData.permissions.find(
          perm => perm.toUpperCase() === checkPermission.toUpperCase()
        );

        if (permissionFound) {
          hasPermission = true;
          if (this.logicalOperation === this.Or) {
            break;
          }
        } else {
          hasPermission = false;
          if (this.logicalOperation === this.And) {
            break;
          }
        }
      }
    } */
    return hasPermission;
  }
}
