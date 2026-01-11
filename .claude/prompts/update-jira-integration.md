# Prompt: Update Jira Integration

Use this template when modifying Jira/Xray integration.

## Prompt Template

```
Update Jira integration to [DESCRIBE_CHANGE]:

Task: [SPECIFIC_REQUIREMENT]

Please modify:

1. Identify affected scripts:
   - scripts/jira-post-execution.ps1 (Test Execution enrichment)
   - scripts/upload-xray.ps1 (Xray result upload)
   - scripts/get-browserstack-build-link.js (BrowserStack link retrieval)

2. If adding custom fields:
   - Obtain field ID from Jira (format: customfield_XXXXX)
   - Add GitHub secret: JIRA_CUSTOM_FIELD_[NAME]
   - Update jira-post-execution.ps1 to populate field
   - Add to workflow environment variables

3. Test the integration:
   - Validate PowerShell syntax (requires PS 7+)
   - Check API authentication
   - Verify field mappings

4. Update documentation:
   - JIRA_AUTOMATION_SETUP.md
   - JIRA_CUSTOM_FIELDS_SETUP.md
   - IMPLEMENTATION_CHECKLIST.md

Ensure compatibility with existing Jira Automation webhooks.
```

## Common Modifications

- Add custom field → Update jira-post-execution.ps1
- Change label format → Modify label update section
- Update title format → Modify Test Execution title logic
- Add remote link → Update remote links section
