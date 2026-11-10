import { URL } from "node:url"
import { readFile } from "node:fs/promises"
const workflow = await readFile(
  new URL("../.github/workflows/dependabot-merge.yml", import.meta.url),
  "utf8"
)
for (const item of [
  "workflow_run:",
  "secrets.RELEASE_MERGER_APP_ID",
  "secrets.RELEASE_MERGER_APP_KEY",
  "merge-tested-dependabot@",
  "app-id: ${{ secrets.RELEASE_MERGER_APP_ID }}",
]) {
  if (!workflow.includes(item))
    throw new Error(`Dependency merger is missing ${item}`)
}
if (
  workflow.includes("secrets.RELEASE_WRITER_APP_") ||
  workflow.includes("pull_request_target:") ||
  workflow.includes("actions/checkout")
) {
  throw new Error(
    "Dependency merging must use its dedicated trusted-CI identity without executing PR code"
  )
}
