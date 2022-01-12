const { commands } = require("vscode");
const listDeps = require("./commands/listDeps");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const _listDeps = commands.registerCommand(
    "view-npm-docs.listDeps",
    listDeps
  );

  context.subscriptions.push(_listDeps);
}

module.exports = {
  activate,
};
