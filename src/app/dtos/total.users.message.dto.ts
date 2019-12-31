import UserDTO from './user.dto';

export default class TotalUsersMessageDTO {
  public total: number;
  public users: UserDTO[];
}
