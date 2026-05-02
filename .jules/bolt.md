## 2024-05-03 - Avoid Redundant AsyncStorage I/O
**Learning:** Functions that compute derived state (like `getUnreadCount`) often trigger independent `AsyncStorage` fetches, causing redundant disk I/O when called sequentially after a primary data fetch.
**Action:** When creating engine methods that perform storage I/O, design them to accept pre-fetched data as an optional argument to eliminate redundant fetches when data is already available in the calling context.
