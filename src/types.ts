export interface AuthUser {
  username: string;
  userId: string;
 signInDetails?: { // Making signInDetails Optional
      loginId: string;
      authFlowType: string;
    };
}