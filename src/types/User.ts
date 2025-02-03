export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }
  
  export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: string;
  }