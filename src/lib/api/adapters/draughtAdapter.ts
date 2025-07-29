/**
 * GICA API Adapter
 * Provides GICA-specific implementations and fallbacks
 */

import { createDataManager } from '../core/dataManager';
import { draughtSchemaConfig } from '../schemas/draughtSchema';
import type { FallbackFactory } from '../core/types';

// GICA-specific fallback data
const draughtFallbacks: Record<string, FallbackFactory> = {
	'': () => ({
		title: 'Draught',
		about: [],
		sentences: [],
		colophon: [],
		issues: {
			title: 'Issues',
			children: [],
			pages: []
		}
	}),
	issues: () => ({
		title: 'Issues',
		text: [],
		pages: [],
		children: []
	}),
	articles: () => ({
		title: 'Articles',
		text: [],
		pages: [],
		children: []
	})
};

/**
 * Create a configured GICA data manager
 */
export function createDraughtDataManager() {
	return createDataManager(draughtSchemaConfig, draughtFallbacks);
}

/**
 * Singleton Draught data manager instance
 */
export const draughtDataManager = createDraughtDataManager();

// Export configured data manager with Draught-specific typing
export type DraughtDataManager = ReturnType<typeof createDraughtDataManager>;

// Helper functions for common Draught operations
export async function getSite() {
	return draughtDataManager.getSite();
}

export async function getIssues() {
	return draughtDataManager.getCollection('issues');
}

export async function getArticles() {
	return draughtDataManager.getCollection('articles');
}

export async function getIssue(id: string) {
	return draughtDataManager.getDetail('issues', id);
}

export async function getArticle(id: string) {
	return draughtDataManager.getDetail('articles', id);
}

/**
 * Preload all Draught data
 */
export async function preloadDraughtData(options?: {
	includeDetails?: boolean;
	cacheImages?: boolean;
	onProgress?: (stage: string, progress: number, total: number) => void;
}) {
	return draughtDataManager.preloadAll(options);
}

/**
 * Clear all Draught cached data
 */
export function clearDraughtCache() {
	draughtDataManager.clearCache();
}
