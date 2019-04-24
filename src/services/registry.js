const { Registry, RequireAll, Library } = require('patron.js');
const path = require('path');
const registry = new Registry({
  library: Library.Eris,
  caseSensitive: false
});

const load = async reg => {
  await reg.registerGlobalTypeReaders();
  await reg.registerLibraryTypeReaders();
  reg.registerTypeReaders(await RequireAll(path.join(__dirname, '../readers')))
    .registerArgumentPreconditions(await RequireAll(
      path.join(__dirname, '../preconditions/argument')
    ))
    .registerPreconditions(await RequireAll(path.join(__dirname, '../preconditions/command')))
    .registerPostconditions(await RequireAll(path.join(__dirname, '../postconditions')))
    .registerGroups(await RequireAll(path.join(__dirname, '../groups')))
    .registerCommands(await RequireAll(path.join(__dirname, '../commands')));
};

load(registry);

module.exports = registry;
