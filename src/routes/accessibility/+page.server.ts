export const prerender = true;

import { getSite } from '$lib/api/adapters/draughtAdapter';

export const load = async () => {
	try {
		const site = await getSite();
		console.log(site);
		return {
			accessibilityStatement: site?.accessibilityStatement || []
		};
	} catch (error) {
		console.error('Error loading accessibility data:', error);
		return { accessibilityStatement: [] };
	}
};
