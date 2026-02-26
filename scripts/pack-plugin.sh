#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

PLUGIN_DIR="armoris-x402-for-woocommerce"
ZIP_FILE="armoris-x402-for-woocommerce.zip"

echo "Packing plugin into $ZIP_FILE..."

# Remove existing zip file
if [ -f "$ZIP_FILE" ]; then
  rm "$ZIP_FILE"
fi

# Create zip file, excluding git and unnecessary files
zip -r "$ZIP_FILE" "$PLUGIN_DIR" -x "*.git*" -x "*node_modules*" -x "*.DS_Store*"

echo "Packed $ZIP_FILE successfully."
