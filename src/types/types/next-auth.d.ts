declare module "next-auth" {
    interface User {
      role?: string
    }
  
    interface Session {
      user: User & {
        role?: string
      }
    }
  }
  
  