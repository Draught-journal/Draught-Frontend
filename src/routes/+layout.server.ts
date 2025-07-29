export const prerender = true;

import { getHome } from '$lib/api/adapters/draughtAdapter';

export const load = async () => {
	try {
		const home = await getHome();
		return { props: { home } };
	} catch (error) {
		console.error('Error loading home data:', error);
		return { props: { home: null } };
	}
};
