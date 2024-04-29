export interface FormData {
    id?: string;
    username?: string;
    email: string;
    password: string;
    phone?: number;
    profilePicture?: string;
    status?: boolean;
    createdAt?: Date;
    }
  
    export interface reduxData {
      _id: string;
      username: string;
      email: string;
      password: string;
      phone?: number;
      profilePicture?: string;
      status?: boolean;
      createdAt?: Date;
    }
    
    