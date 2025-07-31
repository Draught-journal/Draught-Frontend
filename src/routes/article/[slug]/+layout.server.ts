export const prerender = true;
import { getArticles } from '$lib/api';

export async function load({ params }) {
	const articles = await getArticles();
	const article = articles.children.find((article) => article.slug === params.slug);

	if (!article) {
		return { status: 404, error: new Error('Article not found') };
	}
	console.log('Article data:', article);

	return { article };
}
