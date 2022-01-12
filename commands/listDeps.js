const { window } = require("vscode");
const pkgFinder = require("find-package-json");
const { execSync } = require("child_process");

const getUnq = (array) => [...new Set(array)];

const listDeps = async () => {
  const { activeTextEditor } = window;

  if (!activeTextEditor) {
    window.showErrorMessage(
      "Please open any file, to list the dependencies."
    );

    return;
  }

  const currentDir = activeTextEditor.document.uri.fsPath;

  let deps = [];

  const itr = pkgFinder(currentDir);

  const findDeps = (itr) => {
    const currItr = itr.next();

    if (!currItr.done) {
      deps.push(currItr.value);

      findDeps(itr);
    }
  };

  findDeps(itr);

  deps = deps
    .map((pkgObj) => {
      let currDeps = [];

      if (pkgObj.dependencies) {
        currDeps.push(...Object.keys(pkgObj.dependencies));
      }

      if (pkgObj.devDependencies) {
        currDeps.push(...Object.keys(pkgObj.devDependencies));
      }

      return currDeps;
    })
    .flat();

  const selected = await window.showQuickPick(getUnq(deps), {
    placeHolder: "Select module to view docs",
  });

  if (selected) {
    execSync(`open https://npmjs.com/package/${selected}`);
  }
};

module.exports = listDeps;
