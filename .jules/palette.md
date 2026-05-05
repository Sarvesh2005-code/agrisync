## 2024-05-19 - Explicit Accessibility for Icon-Only Buttons
**Learning:** In this application, many `TouchableOpacity` or `Pressable` elements that wrap only `Ionicons` (or other icons) lack necessary accessibility context. The default behavior is insufficient for screen readers.
**Action:** When adding or modifying icon-only interactive elements in React Native (such as in AI Assistant, Home, or Crop screens), ensure they have explicit `accessibilityRole="button"`, `accessibilityLabel`, and `accessibilityHint` properties applied to the wrapper.
