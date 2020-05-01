const dialogs = {}
var req = require.context("./", true, /^(?!.*index.js)((.*\.(vue\.*))[^.]*$)/i);
req.keys().forEach(function (key) {
    const component = req(key).default
    const { name } = component
    if (!name) throw new Error(`dialog component must have name (${key})`)
    dialogs[name] = component;
});
export default dialogs; 