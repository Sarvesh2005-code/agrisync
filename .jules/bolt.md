## 2026-05-05 - Avoid redundant AsyncStorage calls
**Learning:** Engine methods that perform storage I/O (like `getUnreadCount`) can cause performance bottlenecks if called consecutively with other methods doing the same.
**Action:** Pass pre-fetched data as an optional argument to engine methods to eliminate redundant storage fetches when data is already available in the calling context.
