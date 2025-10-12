import fs from 'fs/promises';
export type FileEntry = {
    path: string;
    stat: Awaited<ReturnType<typeof fs.stat>>;
};
export declare const mapFiles: <T>(path: string, mapper: (entry: FileEntry, crumbs: string[]) => Promise<Awaited<T>> | T) => Promise<Array<Awaited<T>>>;
//# sourceMappingURL=iterFiles.d.ts.map