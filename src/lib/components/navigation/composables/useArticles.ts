import type { Issue } from '$lib/api';

export interface ArticlePreview {
	title: string;
	author: string;
	cover?: { url: string; alt?: string | null };
	tags: string[];
}

export function useArticles() {
	function getUniqueTags(issues?: Issue[]): string[] {
		if (!issues || issues.length === 0) return [];

		const allTags = new Set<string>();

		issues.forEach((issue) => {
			if (issue.articles && issue.articles.length > 0) {
				issue.articles.forEach((article) => {
					if (article.tags && article.tags.length > 0) {
						article.tags.forEach((tag) => {
							if (tag && tag.trim()) {
								allTags.add(tag.trim());
							}
						});
					}
				});
			}
		});

		return Array.from(allTags).sort();
	}

	function createArticleHoverState() {
		let hoveredArticle = $state<ArticlePreview | null>(null);

		function handleArticleHover(article: ArticlePreview) {
			hoveredArticle = article;
		}

		function handleArticleLeave() {
			hoveredArticle = null;
		}

		return {
			get hoveredArticle() {
				return hoveredArticle;
			},
			handleArticleHover,
			handleArticleLeave
		};
	}

	return {
		getUniqueTags,
		createArticleHoverState
	};
}
