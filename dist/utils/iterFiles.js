import fs from 'fs/promises';
import pathlib from 'path';
export const mapFiles = async (path, mapper) => {
    const map = async (path, crumbs) => {
        const result = [];
        const entries = (await fs.readdir(path)).map(entry => pathlib.join(path, entry));
        for (const entry of entries) {
            if (['.', '..', '../'].some(it => entry.startsWith(it)))
                continue;
            if (entry.includes('~') || entry.includes('#'))
                continue;
            const stat = await fs.stat(entry);
            if (stat.isDirectory()) {
                const mappedInner = await map(entry, [...crumbs, pathlib.basename(entry)]);
                result.push(...mappedInner);
            }
            const mapped = await mapper({
                path: entry,
                stat
            }, [...crumbs, pathlib.basename(entry)]);
            result.push(mapped);
        }
        return result;
    };
    return await map(path, []);
};
//# sourceMappingURL=iterFiles.js.map