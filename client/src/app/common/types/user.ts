export interface User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  userName: string;
  imageUrl?: string;
  role: string;
  description: string;
  isActive: boolean;
}
