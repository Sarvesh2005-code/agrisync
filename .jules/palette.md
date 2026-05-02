## 2024-05-15 - Icon-only Buttons Accessibility
**Learning:** Found multiple icon-only `TouchableOpacity` components across the React Native app lacking accessibility properties, making navigation difficult for screen reader users.
**Action:** Ensure all icon-only buttons include `accessibilityLabel`, `accessibilityHint`, and `accessibilityRole="button"` to provide proper context.
