# express-dir
> Directory-based routing for express


## Usage
```typescript
import express from "express";
import { setup } from "../../src/setup";
import pathlib from "path";

const app = express();
const port = 3000;

setup(app, {
  routesDirectory: pathlib.resolve(pathlib.join(__dirname, "./routes")),
}).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});

```
