# portbutler.sshlab.dev

The landing page for **PortButler** — native SSH, SFTP and serial for macOS,
in one window.

→ **[portbutler.sshlab.dev](https://portbutler.sshlab.dev)**
→ [Download](https://github.com/Higangssh/portbutler-releases/releases/latest)
· [Releases and update feed](https://github.com/Higangssh/portbutler-releases)

## This repository

Static files, no build step. `public/` is served by a Cloudflare Worker; a push
to `main` deploys it.

```
public/index.html    the page
public/images/       screenshots, icon, mascot
wrangler.jsonc       deployment config
```

Found a problem with the app?
[Open an issue](https://github.com/Higangssh/portbutler-releases/issues/new)
on the releases repository.
