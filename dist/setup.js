import { mapFiles } from "./utils/iterFiles";
const VALID_HANDLER_NAMES = [
    'get',
    'post',
    'put',
    'patch',
    'options',
    'head',
    'del'
];
const getRouterModule = async (entry, crumbs) => {
    if (entry.stat.isDirectory())
        return null;
    if (!entry.path.endsWith('.ts') && !entry.path.endsWith('.js'))
        return null;
    const uri = '/' + crumbs.map((crumb) => {
        if (crumb === 'index.ts' || crumb === 'index.js')
            return '';
        if (crumb.startsWith('[') && crumb.endsWith(']')) {
            const paramName = crumb.replaceAll(/\[|\]/g, '').trim();
            return `:${paramName}`;
        }
        return crumb;
    }).filter(it => it.length > 0).join('/');
    const routerModule = {
        filepath: entry.path,
        uri: uri,
        handlers: {}
    };
    const mod = await import(entry.path);
    if (typeof mod === 'object') {
        for (const [key, value] of Object.entries(mod)) {
            if (!VALID_HANDLER_NAMES.includes(key))
                continue;
            if (typeof value === 'function') {
                routerModule.handlers[key] = value;
            }
        }
    }
    return routerModule;
};
const mergeParamsMiddleware = (req, _res, next) => {
    const q = req.query;
    req.params = Object.assign(req.params, q);
    return next();
};
const registerRoute = (app, mod, key, handler) => {
    const regFn = app[key].bind(app);
    regFn(mod.uri, ...[mergeParamsMiddleware, handler]);
};
const registerModule = (app, mod) => {
    for (const [key, handler] of Object.entries(mod.handlers)) {
        registerRoute(app, mod, key, handler);
    }
};
export const setup = async (app, config) => {
    console.log(`Finding routes...`);
    const mapped = (await mapFiles(config.routesDirectory, async (entry, crumbs) => {
        const mod = await getRouterModule(entry, crumbs);
        if (mod === null)
            return null;
        return mod;
    })).filter(it => it !== null);
    console.log(`Registering routes...`);
    for (const mod of mapped) {
        registerModule(app, mod);
    }
    console.log(`Registered ${mapped.length} routes`);
};
//# sourceMappingURL=setup.js.map