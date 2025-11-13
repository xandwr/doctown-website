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

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  has_docpack: boolean;
}

export interface Docpack {
  id: number;
  name: string;
  version: string;
  ecosystem: string;
  summary: string | null;
  description: string | null;
  homepage: string | null;
  tags: string[];
  github_repo_id: number | null;
  github_repo_full_name: string | null;
  github_repo_url: string | null;
  default_branch: string | null;
  downloads: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface GenerationJob {
  id: number;
  docpack_id: number;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  stage: string | null;
  progress_pct: number;
  log_messages: LogMessage[];
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface LogMessage {
  timestamp: string;
  level: "debug" | "info" | "warning" | "error";
  message: string;
}
