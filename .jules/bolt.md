## 2025-02-20 - Storage I/O Redundancy in Engine Methods
**Learning:** Engine methods that perform storage I/O (like `getUnreadCount`) were fetching data independently, causing redundant `AsyncStorage` reads and `JSON.parse` calls when called sequentially (e.g., `getRecents` followed by `getUnreadCount`).
**Action:** Always design engine methods to accept prefetched data as an optional argument to eliminate redundant storage fetches when the data is already available in the calling context.
