import { Role } from '../enums/role.enum';

export interface UserDto {
  id: string;
  email: string;
  role: Role;
  organizationId: string;
}
