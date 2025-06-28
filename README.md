# POTLOCK Cross Chain Donation Widget

Welcome to the **POTLOCK Cross Chain Donation Widget**, a lightweight, developer-friendly solution for integrating seamless cross-chain donation flows into your project without requiring coding expertise. This widget leverages NEAR Intents and supports multiple blockchain networks, enabling users to donate via QR codes with no wallet setup needed.

## Features

- **Cross-Chain Compatibility**: Supports donations across various blockchain networks including Solana, NEAR, Ethereum, and more.
- **No-Code Integration**: Easily embed the widget into any website with a simple script tag.
- **QR Code Payments**: Generate QR codes for effortless donation transactions.
- **Configurable Themes**: Customize the widget's appearance to match your project's branding.
- **Accessibility**: Adheres to WCAG 2.1 standards for an inclusive user experience.
- **Lightweight**: Bundle size kept under 100 KB for optimal performance.



### Prerequisites

- A modern web browser.
- Access to a NEAR Intents API key (sign up at [NEAR Intents](https://near.org/intents)).
- Basic knowledge of HTML for embedding.

## Usage

- **Embedding**: Place the script in your HTML head or body and initialize with your project details.
- **Customization**: Adjust themes, walletID,AssetName and sDonationType.
- **Donation Flow**: Users scan the QR code, confirm the donation, and receive a confirmation—all handled within the widget.

## Integration

### 1. Calling in HTML

Integrate the widget directly into an HTML page by embedding the script with configuration:

```javascript
const config = {
  Address: address || "your-wallet-id-here",
  donationTarget: donationTarget === "Select Donation Type" ? "POTLOCK Campaigns" : donationTarget,
  buttonColor: buttonColor,
  Asset: asset !== "Select which asset you want to receive." ? asset : "your-asset-name-here",
};

const encodedConfig = btoa(JSON.stringify(config));

const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Widget Test Page</title>
</head>
<body>
  <h1>Test Page</h1>
  <p>This page tests the widget integration.</p>
  <script 
    async 
    src='https://cdn.jsdelivr.net/gh/PotLock/cross-chain-widget@main/dist/widget.js?v=${Date.now()}'
    data-config="${encodedConfig}">
  </script>
</body>
</html>`;
```

**Notes**: 
- Replace `address`, `donationTarget`, `buttonColor`, and `asset` with your actual values or define them in your script.
- Save the `htmlCode` to a `.html` file and open it in a browser to test.
- Ensure the CDN URL is accessible.

### 2. Calling in React.js

Integrate the widget into a React application by dynamically loading the script:

```js
import { useEffect, useRef } from 'react'; 

function App() {
  useEffect(() => {
    const scriptSrc = 'https://cdn.jsdelivr.net/gh/PotLock/cross-chain-widget@main/dist/widget.js?v=${Date.now()}';
    
    // Remove existing script if any
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existing) existing.remove();

    const config = {
      Address: '${address || "your-wallet-id-here"}',
      donationTarget: '${
        donationTarget === "Select Donation Type"
          ? "POTLOCK Campaigns"
          : donationTarget
      }',
      buttonColor: '${buttonColor}',
      Asset: '${
        asset !== "Select which asset you want to receive."
          ? asset
          : "your-asset-name-here"
      }'
    };

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.setAttribute('data-config', btoa(JSON.stringify(config)));

    script.onload = () => {
      if (typeof window.initDonationWidget === 'function') {
        window.initDonationWidget();
      }
    };

    document.body.appendChild(script);

    return () => {
      const s = document.querySelector(`script[src="${scriptSrc}"]`);
      if (s) s.remove();
    };
  }, []);

  return (
    <div>
      <div id="widget-root" style={{ /* your style */ }}></div>
    </div>
  );
}

export default App;
```

**Notes**: 
- Ensure the `address`, `donationTarget`, `buttonColor`, and `asset` variables are defined (e.g., via state or props) before use.
- The `useEffect` dependency array is empty; add dependencies if these config values are dynamic.
- Customize the `style` object in the `widget-root` div to match your design.

## Development

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/PotLock/cross-chain-widget
   cd cross-chain-widget
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Building

To build the widget for production:
```bash
npm run build
```
The output will be in the `dist` folder, ready for deployment.

### Configuration

Edit `vite.config.ts` to adjust build settings or add environment variables for API keys.

## Contributing

We welcome contributions! Please fork the repository, create a feature branch, and submit a pull request. Ensure your code adheres to the project's coding standards and includes tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues or questions, please open an issue on [GitHub](https://github.com/yourusername/potlock-widget/issues) or contact us at support@potlock.org.

## Acknowledgments

- Inspired by the NEAR ecosystem and cross-chain innovation.
- Built with love using React, TypeScript, and Next js.

---

### Badges

![Build Status](https://img.shields.io/badge/build-passing-green)  
![Version](https://img.shields.io/badge/version-1.0.0-blue)

### Last Updated

*This README was last updated at 11:40 AM CDT on Tuesday, June 24, 2025.*
