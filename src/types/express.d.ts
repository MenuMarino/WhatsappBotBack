import { IUserDocument } from 'src/routes/users/models/user.model';

declare global {
  namespace Express {
    export interface Request {
      user: IUserDocument;
    }
  }
}
