const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------
// update-changelog.js <version> <date> <changelog-text>
//
// changelog-text format — one entry per line:
//   Added: Some new feature
//   Fixed: Some bug fix
//   Changed: Some change
//   Removed: Something removed
// -----------------------------------------------------------

const [, , version, date, ...rest] = process.argv;
const rawChangelog = rest.join(' ');

if (!version || !rawChangelog) {
    console.error('Usage: node update-changelog.js <version> <date> "<changelog>"');
    process.exit(1);
}

const PLUGIN_DIR = path.join(__dirname, '../woocommerce-x402');
const CHANGELOG_MD = path.join(PLUGIN_DIR, 'CHANGELOG.md');
const README_TXT = path.join(PLUGIN_DIR, 'readme.txt');
const README_STABLE = path.join(__dirname, '../readme.txt');

// ---- Parse lines into categories ----
const categories = { Added: [], Changed: [], Fixed: [], Removed: [] };

rawChangelog.split('\\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    const match = line.match(/^(Added|Changed|Fixed|Removed):\s*(.+)$/);
    if (match) {
        categories[match[1]].push(match[2]);
    }
});

// ---- Build CHANGELOG.md entry ----
let mdEntry = `## [${version}] - ${date}\n\n`;
for (const [type, items] of Object.entries(categories)) {
    if (items.length === 0) continue;
    mdEntry += `### ${type}\n`;
    items.forEach(item => { mdEntry += `- ${item}\n`; });
    mdEntry += '\n';
}

// Inject AFTER the first "---" divider in CHANGELOG.md
let changelog = fs.readFileSync(CHANGELOG_MD, 'utf8');
changelog = changelog.replace(
    /^---$/m,
    `---\n\n${mdEntry}`
);
// Update [Unreleased] link if present
changelog = changelog.replace(/^\[Unreleased\]/m, `[${version}]`);
fs.writeFileSync(CHANGELOG_MD, changelog);
console.log(`✅ CHANGELOG.md updated with v${version}`);

// ---- Build readme.txt = X.Y.Z = block ----
let readmeEntry = `= ${version} - ${date} =\n`;
for (const [type, items] of Object.entries(categories)) {
    if (items.length === 0) continue;
    readmeEntry += `**${type}**\n`;
    items.forEach(item => { readmeEntry += `* ${item}\n`; });
}
readmeEntry += '\n';

// Inject AFTER "== Changelog ==" section header
let readme = fs.readFileSync(README_TXT, 'utf8');
readme = readme.replace(
    /(== Changelog ==\n\n)/,
    `$1${readmeEntry}`
);
// Bump Stable tag
readme = readme.replace(/^Stable tag: .*/m, `Stable tag: ${version}`);
fs.writeFileSync(README_TXT, readme);
console.log(`✅ readme.txt updated with v${version}`);
