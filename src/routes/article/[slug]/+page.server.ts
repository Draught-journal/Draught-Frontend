import { getSite } from '$lib/api/adapters/draughtAdapter';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	const site = await getSite();
	const issues = Array.isArray(site?.issues) ? site.issues : site?.issues ? [site.issues] : [];

	const slugs = issues.flatMap((issue) =>
		(issue.articles ?? []).map((article) => {
			if (!article.slug || /[/?#]/.test(article.slug)) {
				throw new Error(`Cannot prerender article with invalid slug: ${article.slug}`);
			}
			return article.slug;
		})
	);

	return [...new Set(slugs)].map((slug) => ({ slug }));
};
