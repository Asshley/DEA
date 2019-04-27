const Patron = require('patron.js');
const path = require('path');
const registry = new Patron.Registry({
  library: Patron.Library.Eris,
  caseSensitive: false
});

const load = async reg => {
  await reg.registerGlobalTypeReaders();
  await reg.registerLibraryTypeReaders();
  reg.registerTypeReaders(await Patron.RequireAll(path.join(__dirname, '../readers')))
    .registerArgumentPreconditions(await Patron.RequireAll(
      path.join(__dirname, '../preconditions/argument')
    ))
    .registerPreconditions(await Patron.RequireAll(
      path.join(__dirname, '../preconditions/command')
    ))
    .registerPostconditions(await Patron.RequireAll(path.join(__dirname, '../postconditions')))
    .registerGroups(await Patron.RequireAll(path.join(__dirname, '../groups')))
    .registerCommands(await Patron.RequireAll(path.join(__dirname, '../commands')));
};

load(registry);

module.exports = registry;
