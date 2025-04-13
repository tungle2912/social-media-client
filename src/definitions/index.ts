/**
 * Export all constant, enum, interface, type defined inside definitions folder
 */

/**
 * Resources
 */
import ROUTES_DATA from '~/definitions/resources/routes.json';

export const ROUTES = ROUTES_DATA;

/**
 * Constants
 */
export * from '~/definitions/constants/sample.constant';
export * from '~/definitions/constants/routes.constant';

/**
 * Interfaces
 */
export * from '~/definitions/interfaces/sample.interface';

/**
 * Enums
 */
export * from '~/definitions/enums/sample.enum';
export * from '~/definitions/enums/locale.enum';

/**
 * Types
 */
export * from '~/definitions/types/sample.type';
export * from '~/definitions/types/route.type';
export * from '~/definitions/types/types.d';
