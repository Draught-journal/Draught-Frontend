export const prerender = true;
import { getSite } from '$lib/api/adapters/draughtAdapter';

export async function load({ params }) {
	const site = await getSite();
	const issues = Array.isArray(site?.issues) ? site.issues : site?.issues ? [site.issues] : [];

	let article = null;

	// Find the article across all issues
	for (const issue of issues) {
		const foundArticle = issue.articles?.find((a) => a.slug === params.slug);
		if (foundArticle) {
			article = foundArticle;
			break;
		}
	}

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
