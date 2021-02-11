import MarkdownIt from 'markdown-it';
import { DecisionConfig, MarkDownReplacementOptions } from './types';
declare const DEFAULT_CONFIG: {
    decisions: DecisionConfig[];
    digits: number;
    language: string;
    path: string;
    prefix: string;
    id: number;
    [key: string]: string | number | DecisionConfig[];
};
/**
 * Get current working directory
 *
 * @public
 */
export declare function getWorkDir(): string;
/**
 * Slugify string
 *
 * @param text - { string }
 * @public
 */
export declare function slugify(text: string): string;
/**
 * Generate a decision file. Creates a safe filename
 * and increments id on json.
 *
 * @param name - { string }
 * @param id - { number }
 * @public
 */
export declare function generateFileName(name: string, id?: number): string;
/**
 * Creates a serial prefixed by zeros length.
 *
 * @param id - { number }
 * @param length - { number }
 * @public
 */
export declare function serialNum(id: number, length?: number): string;
/**
 * Update config file.
 *
 * @param config - { DEFAULT_CONFIG }
 * @public
 */
export declare function updateAllConfig(config: typeof DEFAULT_CONFIG): void;
/**
 * Gets all config object.
 *
 * @param defaultValue - { string|number }
 * @public
 */
export declare function getAllConfig(defaultValue: string | number): any;
/**
 * Gets a property from config
 *
 * @param key - { string }
 * @public
 */
export declare function getConfig(key: string): string | number | DecisionConfig[];
/**
 * Add a new DecisionConfig to json.
 *
 * @param decision - { DecisionConfig }
 */
export declare function setNewConfigDecision(decision: DecisionConfig): void;
/**
 * Update a new DecisionConfig to json.
 *
 * @param decision - { DecisionConfig }
 */
export declare function setUpdateConfigDecision(decision: DecisionConfig): void;
/**
 * Markdownit replacement plugin. Finds replacements to exchange it.
 *
 * @param md - { MarkdownIt }
 * @param options - { MarkDownReplacementOptions }
 */
export declare function markdownReplacements(md: MarkdownIt, options?: MarkDownReplacementOptions): void;
/**
 * MarkdownIt plugin to update decision state
 *
 * @param md - { MarkdownIt }
 * @param option - { { oldState: string; newState: string } }
 */
export declare function markdownStateUpdate(md: MarkdownIt, option: {
    oldState: string;
    newState: string;
}): void;
export {};
//# sourceMappingURL=utils.d.ts.map