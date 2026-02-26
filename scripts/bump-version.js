const fs = require('fs');
const path = require('path');

const version = process.argv[2];
const pluginFile = path.join(__dirname, '../armoris-x402-for-woocommerce/armoris-x402-for-woocommerce.php');

if (!version) {
    console.error('Please provide a version number');
    process.exit(1);
}

const content = fs.readFileSync(pluginFile, 'utf8');
const regex = /Version:\s*(\d+\.\d+\.\d+)/;
const match = content.match(regex);

if (match) {
    const newContent = content.replace(regex, `Version: ${version}`);
    fs.writeFileSync(pluginFile, newContent);
    console.log(`Updated plugin version to ${version}`);
} else {
    console.error('Could not find version in plugin file');
    process.exit(1);
}
