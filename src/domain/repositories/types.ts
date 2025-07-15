export type BaseQueryOptions = Partial<{
  offset: number;
  limit: number;
}>;

export type SortBy = "newest" | "oldest" | "mostLiked";
