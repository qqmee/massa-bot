export type Release = {
  name: string;
  date: string;
  url: string;
  changelog: string;
  assets: Array<{ name: string; size: string; url: string }>;
};
