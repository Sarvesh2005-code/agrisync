## 2024-05-03 - Added ARIA attributes to icon-only buttons
**Learning:** Found multiple icon-only interactive elements in `AiAssistantScreen.jsx` without accessibility context, making them difficult to use with screen readers.
**Action:** Always verify if `TouchableOpacity` and `Pressable` wrapping `Ionicons` contain `accessibilityLabel`, `accessibilityHint`, and `accessibilityRole="button"`. Apply this pattern systematically across the codebase.
