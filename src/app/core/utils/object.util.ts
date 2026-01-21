/**
 * Object utility functions for data manipulation
 */

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

