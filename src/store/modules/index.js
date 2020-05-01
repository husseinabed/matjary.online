const modules = {}
const req = require.context("./", false, /^(?!.*index.js)((.*\.(js\.*))[^.]*$)/i);
req.keys().forEach(function (key, x, y) {
    const filename = key.replace('./', '').replace('.js', '')
    modules[filename] = req(key).default
});
export default modules;