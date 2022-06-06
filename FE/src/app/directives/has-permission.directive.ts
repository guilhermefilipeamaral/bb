import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";

import { HasPermissionService } from "../service/has-permission.service";

// Sample usage:
// *hasPermission="'ViewVacancy'"
// *hasPermission="['CreateVacancy']"
// *hasPermission="['ViewVacancy', 'CreateVacancy']; operation 'AND'"

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[hasPermission]"
})
export class HasPermissionDirective {
  private permissions = [];
  private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private hasPermissionService: HasPermissionService,
  ) { }


  @Input()
  set hasPermission(perm: any) {
    if (typeof perm === "string" || perm instanceof String) {
      // this.permissions.push(perm);
    } else {
      this.permissions = perm;
    }
    this.updateView(this.permissions);
  }

  @Input()
  set hasPermissionOperation(operation: string)  {
    this.updateView(this.permissions, operation);
  }

  private updateView(permissions: string[], operation?: string): void {
    if (this.hasPermissionService.checkPermission(permissions, operation)) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }
}
