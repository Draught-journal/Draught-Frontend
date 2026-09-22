import { getSite } from '$lib/api/adapters/draughtAdapter';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	const site = await getSite();
	const issues = Array.isArray(site?.issues) ? site.issues : site?.issues ? [site.issues] : [];

	return issues.flatMap((issue) =>
		(issue.articles ?? []).flatMap((article) => (article.slug ? [{ slug: article.slug }] : []))
	);
};
