## 3.0 Wishlist

- Move plugins/* into master
- Add ability to run local plugins
- Remove red-specific functionality
- Update CLI tool to add custom endpoints, urls

- Move the following tasks out of Robin:
	- resources/tasks/bump.js
	- resources/tasks/default.js
	- resources/tasks/tasks.js

- Keep the cache of files, don't delete / pull every time.
- Use `grunt update` to update the cache.

## 3.0 CLI Wishlist

- `robin nest [URL] [--branch, -b]` - Add a base repository to pull from. Defaults to github.com/ff0000/robin.git
- `robin fly [--include-plugins, -i] [--all -a] [--bare -b]` - Initialize a project
- `robin hatch`

- (Possible?) Add configurable parameters:
	`robin add --parameter [NAME] --`
