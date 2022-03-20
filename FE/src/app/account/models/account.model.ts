export class Account {
  public id!: string;
  public creditNotesWithTax?: number;
  public depositCash?: number;
  public depositCheck?: number;
  public depositTotal?: number;
  public totalPOSWithcommission?: number;
  public totalPOSWithoutcommission?: number;
  public totalRevenueWithTax?: number;
  public totalRevenueWithoutTax?: number;
  public notes?: string;
  public creationDate!: Date;
}
