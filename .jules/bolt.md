## 2024-05-01 - Eliminate redundant AsyncStorage read in NotificationEngine
**Learning:** Engine methods that fetch state often share the same underlying data source (e.g., AsyncStorage). Calling them sequentially in screens leads to redundant I/O, which is slow in React Native offline-first apps using Expo SQLite / AsyncStorage.
**Action:** When creating or modifying engine methods that query storage, design them to accept pre-fetched data as an optional parameter to eliminate redundant storage fetches when the data is already available in the calling context.
