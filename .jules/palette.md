## 2024-05-15 - Missing Accessibility Labels on Icon-Only Buttons
**Learning:** React Native `TouchableOpacity` components wrapping only an `Ionicons` component frequently lack `accessibilityRole`, `accessibilityLabel`, and `accessibilityHint`, which degrades the screen reader experience. This pattern was found across multiple screens.
**Action:** Always verify that interactive elements containing only visual icons include appropriate accessibility attributes to ensure they are screen-reader friendly.
