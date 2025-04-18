export type ExpertAndAdministrationAllowance = {
    id: string;
    claimId?: string;
    claim?: string;
  designation?: string;
  activity?: string;
  day?: string;
  allowance?: Number;
  units? :  Number;
  rate?: Number;
  total?: Number;
  createdAt?: Date;
  updatedAt? : Date;
}