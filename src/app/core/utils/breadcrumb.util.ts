/**
 * Breadcrumb Utility
 * Utility functions for generating breadcrumb paths from navigation constants
 */

import { NAVIGATION_ITEMS, NavigationItem, NavigationChild } from '../constants/navigation.constant';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
  level?: number;
}

/**
 * Find navigation item by route path
 * Recursively searches through navigation structure to find matching route
 */
function findNavigationItemByRoute(
  route: string,
  items: NavigationItem[],
  parentLevel1?: NavigationItem,
  parentLevel2?: NavigationChild,
  parentLevel3?: NavigationChild,
  parentLevel4?: NavigationChild
): {
  found: boolean;
  level1?: NavigationItem;
  level2?: NavigationChild;
  level3?: NavigationChild;
  level4?: NavigationChild;
  level5?: NavigationChild;
} {
  for (const item of items) {
    // Check Level 1 route (NavigationItem)
    if (item.route && route === item.route) {
      return {
        found: true,
        level1: item
      };
    }

    // Check Level 2-5 routes (NavigationChild)
    if (item.children) {
      const result = findChildByRoute(
        route,
        item.children,
        2,
        item,
        undefined,
        undefined,
        undefined
      );
      if (result.found) {
        return {
          found: true,
          level1: item,
          level2: result.level2,
          level3: result.level3,
          level4: result.level4,
          level5: result.level5
        };
      }
    }
  }

  return { found: false };
}

/**
 * Recursively find child navigation item by route
 */
function findChildByRoute(
  route: string,
  children: NavigationChild[],
  level: number,
  parentLevel1: NavigationItem,
  parentLevel2?: NavigationChild,
  parentLevel3?: NavigationChild,
  parentLevel4?: NavigationChild
): {
  found: boolean;
  level2?: NavigationChild;
  level3?: NavigationChild;
  level4?: NavigationChild;
  level5?: NavigationChild;
} {
  for (const child of children) {
    // Strategy: Check exact match first, then search in children, then prefix match
    // This ensures we find the deepest matching route first

    // 1. Check exact match first (for Level 5 items or exact routes)
    const exactMatch = child.route && route === child.route;

    if (exactMatch) {
      // Found exact matching route
      if (level === 2) {
        return {
          found: true,
          level2: child
        };
      } else if (level === 3) {
        return {
          found: true,
          level2: parentLevel2,
          level3: child
        };
      } else if (level === 4) {
        return {
          found: true,
          level2: parentLevel2,
          level3: parentLevel3,
          level4: child
        };
      } else if (level === 5) {
        return {
          found: true,
          level2: parentLevel2,
          level3: parentLevel3,
          level4: parentLevel4,
          level5: child
        };
      }
    }

    // 2. Recursively search in children first (to find deeper matches before checking prefix)
    // This ensures we find Level 5 items before matching parent routes
    if (child.children && child.children.length > 0) {
      const result = findChildByRoute(
        route,
        child.children,
        level + 1,
        parentLevel1,
        level === 2 ? child : parentLevel2,
        level === 3 ? child : parentLevel3,
        level === 4 ? child : parentLevel4
      );
      if (result.found) {
        // If found in children, also include current item as parent (even if no route)
        // This ensures breadcrumb shows full path: Level 3 → Level 4 → Level 5
        if (level === 2) {
          return {
            found: true,
            level2: child, // Include Level 2 parent even if no route
            level3: result.level3,
            level4: result.level4,
            level5: result.level5
          };
        } else if (level === 3) {
          return {
            found: true,
            level2: parentLevel2,
            level3: child, // Include Level 3 parent even if no route
            level4: result.level4,
            level5: result.level5
          };
        } else if (level === 4) {
          return {
            found: true,
            level2: parentLevel2,
            level3: parentLevel3,
            level4: child, // Include Level 4 parent even if no route
            level5: result.level5
          };
        }
      }
    }

    // 3. Check prefix match only if no children AND route is not much deeper
    // Skip prefix match if item has no children but route is much deeper (e.g., /company/human-resources/company-type should not match /company)
    // Only match prefix if this item has no children AND the route is not more than 1 level deeper
    const prefixMatch = child.route && child.route.length > 0 && route.startsWith(child.route + '/');

    // Don't match prefix if route is much deeper than item's route
    // This means there's likely a sibling item that matches better
    const routeDepth = route.split('/').filter(Boolean).length;
    const itemRouteDepth = child.route ? child.route.split('/').filter(Boolean).length : 0;
    const isRouteMuchDeeper = routeDepth > itemRouteDepth + 1; // More than 1 level deeper

    if (prefixMatch && (!child.children || child.children.length === 0) && !isRouteMuchDeeper) {
      // Found prefix matching route (only for items without children and not much deeper)
      if (level === 2) {
        return {
          found: true,
          level2: child
        };
      } else if (level === 3) {
        return {
          found: true,
          level2: parentLevel2,
          level3: child
        };
      } else if (level === 4) {
        return {
          found: true,
          level2: parentLevel2,
          level3: parentLevel3,
          level4: child
        };
      }
    }
  }

  return { found: false };
}

/**
 * Generate breadcrumb path from navigation constants based on route
 * Supports up to 5 levels: Level 1 (Admin) → Level 2 (Company Management) → Level 3 (Human Resources) → Level 4 (Company Information) → Level 5 (Company Type)
 */
export function getBreadcrumbPathFromNavigation(route: string): BreadcrumbItem[] {
  const path: BreadcrumbItem[] = [];

  // Find navigation item by route
  const result = findNavigationItemByRoute(route, NAVIGATION_ITEMS);

  if (!result.found) {
    return path;
  }


  // Level 2: First level child (e.g., Company Management)
  if (result.level2) {
    path.push({
      label: result.level2.label,
      route: result.level2.route,
      icon: result.level2.icon,
      level: 2
    });
  }

  // // Level 3: Second level child (e.g., Human Resources)
  // if (result.level3) {
  //   path.push({
  //     label: result.level3.label,
  //     route: result.level3.route,
  //     icon: result.level3.icon,
  //     level: 3
  //   });
  // }

  // Level 4: Third level child (e.g., Company Information)
  if (result.level4) {
    path.push({
      label: result.level4.label,
      route: result.level4.route,
      icon: result.level4.icon,
      level: 4
    });
  }

  // Level 5: Fourth level child (e.g., Company Type) - deepest level
  if (result.level5) {
    path.push({
      label: result.level5.label,
      route: result.level5.route,
      icon: result.level5.icon,
      level: 5
    });
  }

  return path;
}

/**
 * Get breadcrumb icon based on level
 */
export function getBreadcrumbIcon(level: number): string {
  const iconMap: { [key: number]: string } = {
    1: 'home',
    2: 'business',
    3: 'folder',
    4: 'info',
    5: 'category'
  };
  return iconMap[level] || 'circle';
}

