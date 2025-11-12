export interface SessionUser {
  id: number;
  github_id: number;
  username: string;
  avatar_url: string;
  email_notifications: boolean;
  onboarding_completed: boolean;
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

export interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}
