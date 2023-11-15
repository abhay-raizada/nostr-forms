export type ViewMode = "edit" | "view";

export interface Metadata {
  title: string;
  description: string;
  author: string;
  date: string;
}

export interface BlockBase {
  id: string;
  kind: "metadata" | "link" | "headline" | "text" | "image";
}

export interface Link extends BlockBase {
  url: string;
  title: string;
  description: string;
}

export interface Headline extends BlockBase {
  text: string;
}

export type Block = Link | Headline;

export type Blocks = Block[];

export type Collection = {
  metadata: Metadata;
  blocks: Blocks;
};
