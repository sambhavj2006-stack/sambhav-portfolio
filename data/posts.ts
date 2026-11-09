/**
 * Featured LinkedIn posts for the Signal section. LinkedIn has no public feed API, so
 * these are curated by hand: paste the post URL and its opening line (and optionally a
 * screenshot in public/posts/). While this list is empty, the section shows only the
 * follow/mentor links.
 */
export type Post = {
  id: string;
  href: string;
  /** the post's opening line, verbatim */
  hook: string;
  /** e.g. "Mar 2026" */
  when: string;
  image?: { src: string; alt: string };
};

export const posts: Post[] = [];
