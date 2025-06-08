export class CreateAuditDto {
  action: string;
  userId?: string;
  entity: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
}
