// @flow

import { config, local } from "./lib/config";

const DEFAULT_STYLE = `/* base overlay */
#jp-k-ui-knavi-overlay {
  background-color: gray;
  opacity: 0.2;
  transition-property: left, top, width, height;
  transition-duration: 0.24s;
}

/* hit target overlay */
#jp-k-ui-knavi-active-overlay {
  background-color: red;
  border: 1px solid white;
  opacity: 0.1;
  transition-property: left, top, width, height;
  transition-duration: 0.12s;
  animation: pulse 2s linear infinite;
  z-index: 2;
}
@keyframes pulse {
  0% {
    box-shadow:
    0 0 0 0 rgba(128,128,128,0.8),
    0 0 0 0 rgba(255,0,0,0.8);
  }
  10% {
    box-shadow:
    0 0 3px 0px rgba(128,128,128,0.8),
    0 0 3px 8px rgba(255,0,0,0.8);
  }
  80% {
    box-shadow:
    0 0 3px 56px rgba(128,128,128,0.8),
    0 0 3px 64px rgba(255,0,0,0.8);
  }
  100% {
    box-shadow:
    0 0 3px 72px rgba(128,128,128,0),
    0 0 3px 80px rgba(255,0,0,0);
  }
}

/* hit marker styles. */
.jp-k-ui-knavi-hint {
  margin: 0px;
  padding: 3px;
  background-color: #333;
  color: white;
  border: white solid 1px;
  line-height: 1em;
  font-size: 16px;
  font-family: monospace;
}
.jp-k-ui-knavi-hint[data-state="disabled"] {
  opacity: 0.6;
  z-index: 0;
}
.jp-k-ui-knavi-hint[data-state="candidate"] {
  background-color: yellow;
  color: black;
  border: black solid 1px;
  z-index: 1;
}
.jp-k-ui-knavi-hint[data-state="hit"] {
  background-color: #c00;
  color: white;
  border: black solid 1px;
  font-weight: bold;
  z-index: 2;
}

/* add action description into hit marker. */
.jp-k-ui-knavi-hint:after {
  content: attr(data-action-description);
  font-size: 50%;
  position: absolute;
  background-color: #333;
  color: white;
  border: #ccc 1px solid;
  padding: 3px;
  border-radius: 4px;
  line-height: 1em;
  transition: 200ms;
  left: 0px;
  z-index: -1;
  opacity: 0;
}
.jp-k-ui-knavi-hint[data-state="hit"]:after {
  transition-delay: 100ms;
  left: calc(100% + 4px);
  opacity: 1;
}
`.replace(/(^|\n)\t+/g, "$1");

const DEFAULT_VALUES = new Map([
  ["magic-key", "Space"],
  ["hints", "ASDFGHJKL"],
  ["blur-key", ""],
  ["css", DEFAULT_STYLE],
]);

async function init() {
  await initArea();
  await Promise.all(Array.from(DEFAULT_VALUES.entries()).map(([n, v]) => initValue(n, v)));
}

async function initArea() {
  await initValueByStorage(local, "_area", "chrome-sync");
}

async function initValue(name: string, defaultValue: string) {
  await initValueByStorage(config, name, defaultValue);
}

async function initValueByStorage(storage: local | config, name: string, defaultValue: string) {
  console.log(storage.storage);
  console.log(storage.getStorage && await storage.getStorage());
  const v = await storage.getSingle(name);
  if (v == null) {
    console.log("Init value: %o=%o", name, defaultValue);
    await storage.setSingle(name, defaultValue);
  } else {
    console.log("Already value set: %o=%o", name, v);
  }
}

init().then(() => console.log("Done init"));
