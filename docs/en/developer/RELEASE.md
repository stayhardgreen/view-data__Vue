# Releasing uPortal-web-components

1. `git pull upstream master`
   - synchronizes with latest official version
2. Update the "unreleased" section of _CHANGELOG.md_ with an overview of changes
3. `npm run build`
   - build needs to happen before `publish` because it takes longer than the 30s otp timeout
4. `lerna version {patch or minor or major}`
   - determine new release number based off commit messages
     - `patch` for a release containing no `feat` or `BREAKING CHANGE` commits
     - `minor` for a release containing `feat` but no `BREAKING CHANGE` commits
     - `major` for a release containing `BREAKING CHANGE` commits
5. `NPM_CONFIG_OTP={npm otp token} lerna publish from-git`
   - pushes release to npm
   - :notebook: This module requires [two factor authentication][] to cut a release
6. `git push upstream master`
   - push release commit
7. `git push upstream --tags`
   - push release tag
8. Add a new release header to _CHANGELOG.md_
   - also update the links at the bottom of the page

[two factor authentication]: https://docs.npmjs.com/getting-started/using-two-factor-authentication
