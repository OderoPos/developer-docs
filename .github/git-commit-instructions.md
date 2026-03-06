# Git Commit Message Guidelines

## Format
```
JIRA-ID: Description
```

## Example
```
TST-570: Add validation logic
```

## Rules

1. **JIRA ID**: Use the Jira ID from your branch name if available (e.g., `TST-570`, `X330-426`)

Example branch names:
   - `feature/TST-570-add-validation-logic` → JIRA ID: `TST-570`
   - `bugfix/X330-426-fix-scroll-issue` → JIRA ID: `X330-426`

2. **Separator**: Use colon `:` after JIRA ID (NOT brackets)
   - ✅ Correct: `TST-570: Add validation logic`
   - ❌ Wrong: `[TST-570] Add validation logic`

3. **Description**:
   - Minimum 3 characters
   - Capitalize first letter
   - Use imperative mood (e.g., "Add", "Fix", "Update", "Remove")

4. **Length**: Keep under 100 characters total

5. **No JIRA ID**: If your branch has no JIRA ID, omit it entirely
   ```
   Add validation logic
   ```

## More Examples

```
X330-426: Fix scroll issue in Netopia payment screen
TST-123: Update Gradle dependencies
PROJ-456: Remove deprecated API calls
Update README documentation
```

## Notes

- The JIRA ID should be automatically extracted from your branch name
- Use imperative mood: "Fix bug" not "Fixed bug" or "Fixes bug"
- Be concise but descriptive

