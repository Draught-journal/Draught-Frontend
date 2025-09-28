export const prerender = true;
import { getSite } from '$lib/api/adapters/draughtAdapter';

export async function load({ params }) {
	const site = await getSite();
	const issues = Array.isArray(site?.issues) ? site.issues : site?.issues ? [site.issues] : [];

	let article = null;
	let articleNumber = '1.0.1'; // Default fallback

	// Find the article and calculate its number
	for (let issueIndex = 0; issueIndex < issues.length; issueIndex++) {
		const issue = issues[issueIndex];
		const articleIndex = issue.articles?.findIndex((a) => a.slug === params.slug);

		if (articleIndex !== undefined && articleIndex >= 0) {
			article = issue.articles[articleIndex];
			const safeIssueNumber = issueIndex + 1;
			articleNumber = `${safeIssueNumber}.0.${articleIndex + 1}`;
			break;
		}
	}

	if (!article) {
		// Use a serializable error format instead of Error object
		return {
			status: 404,
			errorMessage: 'Article not found',
			article: null,
			articleNumber: '1.0.1',
			showNav: true
		};
	}

	return {
		article,
		articleNumber,
		// Signal that nav should be visible on article pages
		showNav: true
	};
}
