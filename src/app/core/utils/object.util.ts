/**
 * Object utility functions for data manipulation
 */

/**
 * Converts a snake_case string to camelCase.
 * e.g. edit_by -> editBy, position_group_id -> positionGroupId
 * Keys without underscore are left as-is (caller may map separately if needed).
 */
export function snakeToCamel(str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case.
 * e.g. editBy -> edit_by, positionGroupId -> position_group_id
 */
export function camelToSnake(str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Recursively converts all keys of an object (and nested objects/arrays) from snake_case to camelCase.
 * Use when mapping API response (snake_case) to frontend model (camelCase).
 */
export function snakeToCamelKeys<T = any>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => snakeToCamelKeys(item)) as T;
  if (typeof obj !== 'object') return obj;
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const camelKey = snakeToCamel(key);
    result[camelKey] = snakeToCamelKeys((obj as any)[key]);
  }
  return result as T;
}

/**
 * Recursively converts all keys of an object (and nested objects/arrays) from camelCase to snake_case.
 * Use when sending frontend model (camelCase) to API (snake_case).
 */
export function camelToSnakeKeys<T = any>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => camelToSnakeKeys(item)) as T;
  if (typeof obj !== 'object') return obj;
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const snakeKey = camelToSnake(key);
    result[snakeKey] = camelToSnakeKeys((obj as any)[key]);
  }
  return result as T;
}

/**
 * Filters out Syncfusion Grid internal fields from row data
 * Removes fields like 'column', 'index', etc. that are added by Syncfusion Grid
 *
 * @param row - Row data from Syncfusion Grid (may contain internal fields)
 * @param modelFields - Array of field names that should be kept (from model interface)
 * @returns Clean object with only model fields
 *
 * @example
 * ```typescript
 * const modelFields: (keyof BankCompany)[] = ['companyId', 'bankId', 'lineNo'];
 * const cleanRow = filterSyncfusionFields(row, modelFields);
 * ```
 */
export function filterSyncfusionFields<T extends Record<string, any>>(
  row: any,
  modelFields: (keyof T)[]
): Partial<T> {
  const cleanRow: Partial<T> = {};

  modelFields.forEach(field => {
    if (row[field] !== undefined) {
      cleanRow[field] = row[field];
    }
  });

  return cleanRow;
}

/**
 * Removes Syncfusion Grid internal fields from an object
 * Common internal fields: 'column', 'index', '__rowIndex', '__visibleIndex'
 *
 * @param obj - Object that may contain Syncfusion Grid internal fields
 * @param excludeFields - Additional fields to exclude (optional)
 * @returns Clean object without internal fields
 *
 * @example
 * ```typescript
 * const cleanRow = removeSyncfusionFields(row);
 * ```
 */
export function removeSyncfusionFields(
  obj: any,
  excludeFields: string[] = []
): any {
  const internalFields = ['column', 'index', '__rowIndex', '__visibleIndex', ...excludeFields];
  const cleanObj: any = {};

  Object.keys(obj).forEach(key => {
    if (!internalFields.includes(key)) {
      cleanObj[key] = obj[key];
    }
  });

  return cleanObj;
}

