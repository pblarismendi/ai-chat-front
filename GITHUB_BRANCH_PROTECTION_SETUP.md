# GitHub Branch Protection Setup

To ensure that only approved changes are merged into the master branch, follow these steps to set up branch protection rules in your GitHub repository.

## Setting up Branch Protection Rules

1. Go to your repository on GitHub.
2. Click on **Settings** tab.
3. In the left sidebar, click on **Branches**.
4. Under "Branch protection rules", click on **Add rule**.
5. In the "Branch name pattern" field, enter `master`.
6. Configure these settings:

   - ✅ **Require pull request reviews before merging**

     - ✅ Set "Required approvals" to `1`
     - ✅ Check "Dismiss stale pull request approvals when new commits are pushed"

   - ✅ **Require status checks to pass before merging**

     - ✅ Check "Require branches to be up to date before merging"
     - ✅ Add the "check-owner" status check when it appears after your first workflow run

   - ✅ **Require conversation resolution before merging**
   - ✅ **Include administrators** (optional, but recommended for consistency)
   - ✅ **Restrict who can push to matching branches**

     - Add yourself as an allowed user

7. Click **Create** or **Save changes**.

## Exception for Repository Owner

The included GitHub workflow (`.github/workflows/branch-protection.yml`) contains logic to identify if a PR is created by the repository owner. If you are the owner, the workflow will acknowledge this, effectively allowing you to bypass the review requirement if you have admin permissions.

## Files In This Setup

1. `.github/CODEOWNERS`: Defines who needs to review changes to specific parts of the codebase.

   - Remember to change `@TU_NOMBRE_DE_USUARIO_GITHUB` to your actual GitHub username.

2. `.github/CONTRIBUTING.md`: Documentation explaining the contribution process.
3. `.github/workflows/branch-protection.yml`: GitHub Actions workflow to enforce branch protection rules.

These configurations, combined with GitHub's branch protection settings, will ensure that:

- All changes to master require a PR (except yours if you have admin rights and bypassed protections)
- PRs from other contributors require your explicit approval
- You can contribute directly without requiring approval from anyone else
