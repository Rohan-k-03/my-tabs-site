import test from "node:test";
import assert from "node:assert/strict";
import { buildStandaloneMarkup } from "../src/lib/tabMarkup.js";

test("buildStandaloneMarkup outputs inline styles and script", () => {
  const html = buildStandaloneMarkup(["Alpha", "Beta"], ["A", "B"], 0);
  assert.match(html, /role="tablist"/);
  assert.match(html, /data-role="tab-btn"/);
  assert.match(html, /<script>/);
  assert.match(html, /window\.activateTab/);
  assert.match(html, /display: block/);
});

test("active tab state toggles aria attributes", () => {
  const index = 1;
  const html = buildStandaloneMarkup(["Tab 1", "Tab 2", "Tab 3"], ["One", "Two", "Three"], index);
  const selectedCount = (html.match(/aria-selected="true"/g) || []).length;
  assert.equal(selectedCount, 1, "only one tab should be selected");
  const tabPos = html.indexOf(`id="tab-${index + 1}`);
  assert.ok(tabPos >= 0, "active tab button rendered");
  const selectedPos = html.indexOf('aria-selected="true"', tabPos);
  assert.ok(selectedPos > tabPos, "active tab carries aria-selected true");
  const panelPos = html.indexOf(`id="panel-${index + 1}`);
  const displayPos = html.indexOf("display: block", panelPos);
  assert.ok(panelPos >= 0 && displayPos > panelPos, "active panel is visible");
});
