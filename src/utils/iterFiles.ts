import fs from 'fs/promises';
import pathlib from 'path';


export type FileEntry = {
  path: string;
  stat: Awaited<ReturnType<typeof fs.stat>>;
}

export const mapFiles = async <T>(
  path: string,
  mapper: (entry: FileEntry, crumbs: string[]) => Promise<Awaited<T>> | T
): Promise<Array<Awaited<T>>> => {

  const map = async (path: string, crumbs: string[]): Promise<Array<Awaited<T>>> => {
    const result: Array<Awaited<T>> = [];
    const entries = (await fs.readdir(path)).map(entry => pathlib.join(path, entry));

    for (const entry of entries) {
      if (['.', '..', '../'].some(it => entry.startsWith(it))) continue;
      if (entry.includes('~') || entry.includes('#')) continue;
      
      
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
  }

  return await map(path, []);
}
