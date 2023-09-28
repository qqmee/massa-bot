export type GitHubApiLatestRelease = {
  html_url: string;
  tag_name: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Array<{
    size: number;
    name: string;
    download_count: number;
    browser_download_url: string;
  }>;
  body: string;
};
