export class BaseAccount {
  public CreditNotesWithTax = 0;
  public DepositCash = 0;
  public DepositCheck = 0;
  public DepositTotal = 0;
  public TotalPOSWithcommission = 0;
  public TotalPOSWithoutcommission = 0;
  public TotalRevenueWithTax = 0;
  public TotalRevenueWithoutTax = 0;
  public Notes = "";
}

export class Account extends BaseAccount {
  public Id: string | undefined;
  public CreationDate: Date | undefined;
  public StoreId?: number | null;
}
