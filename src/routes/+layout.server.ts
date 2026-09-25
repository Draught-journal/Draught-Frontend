export const prerender = true;
// Rendering runs at build time; adapter-static emits no runtime rendering server.

import { getSite } from '$lib/api/adapters/draughtAdapter';
import { building } from '$app/environment';

export const load = async () => {
	try {
		// Fetch home articles
		const site = await getSite();
		return { props: { site } };
	} catch (error) {
		if (building) throw error;
		console.error('Error loading home data:', error);
		return { props: { site: null } };
	}
};
