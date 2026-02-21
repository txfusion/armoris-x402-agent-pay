#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

PLUGIN_DIR="woocommerce-x402"
ZIP_FILE="woocommerce-x402.zip"

echo "Packing plugin into $ZIP_FILE..."

# Remove existing zip file
if [ -f "$ZIP_FILE" ]; then
  rm "$ZIP_FILE"
fi

# Create zip file, excluding git and unnecessary files
zip -r "$ZIP_FILE" "$PLUGIN_DIR" -x "*.git*" -x "*node_modules*" -x "*.DS_Store*"

echo "Packed $ZIP_FILE successfully."
