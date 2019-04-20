const { Registry, RequireAll } = require('patron.js');
const path = require('path');
const registry = new Registry({
  library: 'discord.js',
  caseSensitive: false
});

(async r => {
  await r.registerGlobalTypeReaders();
  await r.registerLibraryTypeReaders();
  r.registerTypeReaders(await RequireAll(path.join(__dirname, '../readers')))
    .registerArgumentPreconditions(await RequireAll(
      path.join(__dirname, '../preconditions/argument')
    ))
    .registerPreconditions(await RequireAll(path.join(__dirname, '../preconditions/command')))
    .registerPostconditions(await RequireAll(path.join(__dirname, '../postconditions')))
    .registerGroups(await RequireAll(path.join(__dirname, '../groups')))
    .registerCommands(await RequireAll(path.join(__dirname, '../commands')));
})(registry);

module.exports = registry;
