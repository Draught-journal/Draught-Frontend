export const prerender = true;

import { getSite } from '$lib/api/adapters/draughtAdapter';

export const load = async () => {
	try {
		// Fetch home articles
		const site = await getSite();
		return { props: { site } };
	} catch (error) {
		console.error('Error loading home data:', error);
		return { props: { site: null } };
	}
};
