export type Claim = {
    id?: string;
  userId?: string;
  user?: string;
  activity?: string;
  station?: string;
  from?: string;
  to?: string;
  venue?: string;
  checkedBy?: string;
  approvedBy? : string;
  status?: string;
  acquittalStatus? : string;
  amount? : string;
  comment?: string;
  advanceAmount?: string;
  acquittedAmount?: string;
  refundAmount? : string;
  extraClaimAmount ?: string;
  travellingAndSubsistence?: string;
  expertAndAdministrationAllowances?: string;
  createdAt?: string;
  updatedAt?: string;
}