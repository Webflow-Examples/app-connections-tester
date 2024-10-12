# App Connections Tester

Small App used to validate App Connections APIs.

<img width="858" alt="image" src="https://github.com/user-attachments/assets/d9227620-4db6-45bb-a781-5f9b1ca5b46d">

## Local Development

Enter the following command in your terminal.

```bash
npm run dev
```

This command installs dependencies, watches for changes in the `src/` folder, and serves your extension files from `./dist/`.

### Run a development App in the Webflow Designer

1. [Create an App](https://developers.webflow.com/data/docs/register-an-app) with the Designer Extension capability in your Workspace.
2. Install the App to the site you wish to test your App on.
3. Open the site you wish to test in the Webflow designer
4. Use the displayed URL as the "Development URL" in the Apps panel in the Designer
5. Toggle the checkbox for "Launch development App by default"
6. Launch your development App

## Build for Distribution

Enter the following command in the terminal.

```bash
npm run build
```

This command prepares a `${bundleFile}` in the `./dist/` folder. Upload this `bundle.zip` file for distributing the App inside of your workspace or via the Marketplace.

### Run an App in the Webflow Designer

1. [Create an App](https://developers.webflow.com/data/docs/register-an-app) with the Designer Extension capability in your Workspace.
2. Install the App to the site you wish to test your App on.
3. Navigate to the "App Development" section of your Workspace settings and finr your App.
4. Click the "Publish extension version" button to [upload your your](https://developers.webflow.com/data/docs/publishing-your-app#uploading-and-publishing-your-extension) `bundle.zip` file in your App Settings
5. Open the site you wish to test in the Webflow designer
6. Find your App in the App drawer and launch your App
