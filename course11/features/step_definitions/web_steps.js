const assert = require("assert");
const { By, until } = require("selenium-webdriver");
const { When, Then } = require("@cucumber/cucumber");
const { driver, getButton } = require("./world");

When("I press the {string} button", async function (buttonText) {
  const button = await getButton(buttonText);
  await button.click();
  await driver.sleep(500);
});

Then("I should see {string} in the results", async function (text) {
  const resultsContainer = await driver.wait(until.elementLocated(By.id("search_results")), 10000);
  const resultsText = await resultsContainer.getText();
  assert.ok(resultsText.includes(text), `Expected to see "${text}" in search results.`);
});

Then("I should not see {string} in the results", async function (text) {
  await driver.wait(until.elementLocated(By.id("search_results")), 10000);
  const resultsContainer = await driver.findElement(By.id("search_results"));
  const resultsText = await resultsContainer.getText();
  assert.ok(!resultsText.includes(text), `Expected not to see "${text}" in search results.`);
});

Then("I should see the message {string}", async function (expectedMessage) {
  const messageElement = await driver.wait(until.elementLocated(By.id("flash_message")), 10000);
  const actualMessage = await messageElement.getText();
  assert.ok(
    actualMessage.includes(expectedMessage),
    `Expected message "${expectedMessage}", but got "${actualMessage}"`
  );
});
