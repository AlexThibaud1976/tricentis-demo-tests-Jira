### Confluence Reporting (optional)

High-level test reporting can be published to Confluence via two complementary approaches:

1. **Jira macros** (manual setup in Confluence editor): real-time dashboards with Jira Issues tables and charts
2. **CI/CD script** (`scripts/update-confluence-report.js`): historical execution table, updated automatically after each run

The CI/CD approach is controlled by a **toggle** (`confluenceReport`) in the GitHub Actions workflow dispatch inputs. It is disabled by default.

**Note**: Xray for Jira Cloud does **not** provide native Confluence macros. For basic reporting, use standard Jira macros (Jira Issues, Jira Charts). For advanced Xray analytics, third-party add-ons are required (e.g., eazyBI).

**Required secrets** (for CI/CD approach): `CONFLUENCE_URL`, `CONFLUENCE_USER`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_KEY`. Optional: `CONFLUENCE_PAGE_TITLE`, `CONFLUENCE_PARENT_PAGE_ID`.

See `CONFLUENCE_REPORTING_GUIDE.md` for complete setup instructions and limitations.