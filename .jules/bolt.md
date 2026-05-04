## Journal

## 2023-10-27 - Redundant AsyncStorage IO on App Load
**Learning:** Engine methods calculating aggregate states (like unread notification count) often perform their own distinct `AsyncStorage` reads. If the UI component (e.g., `HomeScreen`) already fetches this data to display the list, the engine's internal read is redundant, creating overlapping asynchronous I/O bottlenecks.
**Action:** Always check if aggregate calculating methods (like `getUnreadCount`) can accept pre-fetched list data via optional parameters. This pattern eliminates double-reads when the calling component already has the data.
