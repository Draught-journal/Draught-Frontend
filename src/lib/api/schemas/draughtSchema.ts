import type {
	SchemaConfig,
	ProjectSchema,
	GenericCollection,
	MediaAsset,
	GenericDateStructure
} from '../core/types';

export interface TextContent {
	text: string;
}

export interface ImageContent {
	location: string;
	image: MediaAsset[];
	src: string;
	alt: string;
	caption: string;
	link: string;
	ratio: string;
	crop: string;
}

export interface TextBlockValue {
	value: string;
}

// GICA Content blocks
export interface TextContentBlock {
	id: string;
	type: 'text';
	isHidden?: boolean;
	content: TextContent;
}

export interface ImageContentBlock {
	id: string;
	type: 'image';
	isHidden?: boolean;
	content: ImageContent;
}

export type ContentBlock = TextContentBlock | ImageContentBlock;

export interface Home {
	title: string;
	about: ContentBlock[];
	sentences: string[];
	colophon: ContentBlock[];
	issues: GenericCollection<Issue>;
}

export interface Issue {
	id: string;
	title: string;
	slug: string;
	url: string;
	published: GenericDateStructure;
	color: string;
	tags: string[];
	articles: GenericCollection<Article>;
}

export interface Article {
	id: string;
	title: string;
	slug: string;
	url: string;
	author: string;
	cover: MediaAsset;
	published: GenericDateStructure;
	content: ContentBlock[];
	tags: string[];
}

export interface Issues extends GenericCollection<Issue> {
	text: ContentBlock[];
}

export interface Articles extends GenericCollection<Article> {
	text: ContentBlock[];
}

export interface DraughtSchema extends ProjectSchema {
	collections: {
		issues: Issues;
		articles: Articles;
	};
	pages: {
		home: Home;
	};
	details: {
		issues: Issue;
		articles: Article;
	};
}

// Type guards
export function isTextContentBlock(block: ContentBlock): block is TextContentBlock {
	return block.type === 'text';
}

export function isImageContentBlock(block: ContentBlock): block is ImageContentBlock {
	return block.type === 'image';
}

export const draughtSchemaConfig: SchemaConfig<DraughtSchema> = {
	schema: {} as DraughtSchema,
	collectionTypes: ['issues', 'articles'],
	pageTypes: ['home'],
	detailTypes: ['issues', 'articles']
};

// Utility types
export type CollectionType = keyof DraughtSchema['collections'];
export type PageType = keyof DraughtSchema['pages'];
export type DataType = CollectionType | PageType;
export type DetailType = Issue | Article;

// Collection mappings for backward compatibility
export interface CollectionMap {
	issues: Issue;
	articles: Article;
}

export interface PageMap {
	home: Home;
}

export interface DetailMap {
	issues: Issue;
	articles: Article;
}

export interface DataMap extends CollectionMap, PageMap {}
