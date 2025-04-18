import { ExpertAndAdministrationAllowance } from "./expertAllowances";
import { SupportingDocument } from "./supportingDocument";
import { TravellingAndSubsistence } from "./travellingAndSubsistence";

export type Claim = {
  id?: string;
  userId?: string;
  user?: string;
  activity?: string;
  station?: string;
  from?: Date;
  to?: Date;
  venue?: string;
  checkedBy?: string;
  checker?: string;
  approvedBy?: string;
  status?: string;
  acquittalStatus?: string;
  amount?: string;
  comment?: string;
  advanceAmount?: number;
  acquittedAmount?: number;
  refundAmount?: number;
  extraClaimAmount?: number;
  travellingAndSubsistence: TravellingAndSubsistence[];
  expertAndAdministrationAllowances: ExpertAndAdministrationAllowance[];
  SupportingDocuments: SupportingDocument[];
  createdAt?: Date;
  updatedAt?: Date;
};
