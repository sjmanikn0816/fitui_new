// scripts/bump-version.js
const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(__dirname, "../package.json");
const appPath = path.resolve(__dirname, "../app.json");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const app = JSON.parse(fs.readFileSync(appPath, "utf8"));

function bumpVersion(version) {
  let [major, minor, patch] = version.split(".").map(Number);
  patch++;
  return `${major}.${minor}.${patch}`;
}

const newVersion = bumpVersion(pkg.version);

pkg.version = newVersion;
app.expo.version = newVersion;
app.expo.android.versionCode = (app.expo.android.versionCode || 1) + 1;
app.expo.ios.buildNumber = String(
  Number(app.expo.ios.buildNumber || "1") + 1
);

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
fs.writeFileSync(appPath, JSON.stringify(app, null, 2));

console.log(`✅ Version bumped to ${newVersion}`);
