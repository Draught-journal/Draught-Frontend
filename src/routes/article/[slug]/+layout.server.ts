export const prerender = true;
import { getArticles } from '$lib/api';

export async function load({ params }) {
	const articles = await getArticles();
	const article = articles.children.find((article) => article.slug === params.slug);

	if (!article) {
		// Use a serializable error format instead of Error object
		return {
			status: 404,
			errorMessage: 'Article not found',
			article: null,
			showNav: true
		};
	}

	return {
		article,
		// Signal that nav should be visible on article pages
		showNav: true
	};
}
