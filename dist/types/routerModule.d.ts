import { type RequestHandler } from 'express';
export type RouterModule = {
    filepath: string;
    uri: string;
    handlers: {
        [key: string]: RequestHandler;
    };
};
//# sourceMappingURL=routerModule.d.ts.map