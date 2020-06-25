export interface User {
  username: string;
  password: string;
  email: string;
  profilePicture: string;
  created_at?: Date;
  updated_at?: Date;
}