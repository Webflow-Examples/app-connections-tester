# App Connections Tester

Small App used to validate App Connections APIs.

<img width="863" alt="image" src="https://github.com/user-attachments/assets/da13ad23-74c1-407e-a15e-df246d48be32">

## Local Development

```bash
npm run dev
```

This command installs dependencies, watches for changes in the `src/` folder, and serves your extension files from `./dist/`. Use the displayed URL as the "Development URL" in Webflow Designer's Apps panel to launch your extension.

## Build for Distribution

```bash
npm run build
```

This command prepares a `${bundleFile}` in the `./dist/` folder. Upload this `bundle.zip` file for distributing the App inside of your workspace or via the Marketplace.
