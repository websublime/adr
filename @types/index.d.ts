
export declare interface DecisionConfig {
    date: string;
    filename: string;
    id: number;
    name: string;
    state: string;
}

/**
 * Creates a serial prefixed by zeros length.
 *
 * @param id - { number }
 * @param length - { number }
 * @public
 */
export declare function serialNum(id: number, length?: number): string;

/**
 * Slugify string
 *
 * @param text - { string }
 * @public
 */
export declare function slugify(text: string): string;

export { }
