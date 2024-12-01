export interface AuthUser {
    username: string;
    userId: string;
    signInDetails: {
      loginId: string;
      authFlowType: string;
    };
  }
  