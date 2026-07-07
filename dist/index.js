#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_mcp = require("@modelcontextprotocol/sdk/server/mcp.js");
var import_node = __toESM(require("@rymi/node"));
var import_ops_tools = require("@rymi/ops-tools");

// src/utils/errors.ts
function handleMcpError(err) {
  const e = err;
  const body = { error: e?.message || String(err) };
  if (e?.code) body.code = e.code;
  if (e?.status) body.status = e.status;
  return { isError: true, content: [{ type: "text", text: JSON.stringify(body, null, 2) }] };
}
function withToolErrors(handler) {
  return async (args) => {
    try {
      return await handler(args);
    } catch (err) {
      return handleMcpError(err);
    }
  };
}

// package.json
var package_default = {
  name: "@rymi/mcp",
  version: "1.0.0",
  description: "Rymi MCP server \u2014 manage AI voice agents via Model Context Protocol",
  license: "MIT",
  author: "Rymi AI <engineering@rymi.live>",
  homepage: "https://rymi.live",
  keywords: [
    "mcp",
    "model-context-protocol",
    "voice-ai",
    "voice-agent",
    "claude",
    "cursor",
    "rymi"
  ],
  repository: {
    type: "git",
    url: "git+https://github.com/rymi-live/rymi-mcp.git"
  },
  bugs: {
    url: "https://github.com/rymi-live/rymi-mcp/issues"
  },
  publishConfig: {
    access: "public",
    provenance: true
  },
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  bin: {
    "rymi-mcp": "./dist/index.js"
  },
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      require: "./dist/index.js"
    }
  },
  scripts: {
    build: "tsup src/index.ts --format cjs --dts --clean",
    dev: "tsup src/index.ts --format cjs --watch",
    lint: "tsc --noEmit",
    test: "vitest run"
  },
  dependencies: {
    "@modelcontextprotocol/sdk": "^1.11.1",
    "@rymi/node": "workspace:*",
    "@rymi/ops-tools": "workspace:*",
    zod: "^3.23.0"
  },
  devDependencies: {
    tsup: "^8.0.0",
    typescript: "^5.0.0",
    vitest: "^1.6.0"
  },
  files: [
    "dist",
    "README.md",
    "LICENSE"
  ]
};

// src/server.ts
function createServer(apiKey) {
  const rymi = new import_node.default({ apiKey });
  const server = new import_mcp.McpServer({
    name: "rymi",
    version: package_default.version
  });
  const isReadOnly = process.env.RYMI_MCP_READONLY === "1";
  for (const tool of import_ops_tools.opsToolCatalog) {
    if (isReadOnly && tool.risk !== "read") continue;
    server.tool(
      tool.name,
      tool.description,
      tool.input,
      withToolErrors(async (params) => {
        const result = await tool.run(rymi, params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      })
    );
  }
  return server;
}

// src/transport/stdio.ts
var import_stdio = require("@modelcontextprotocol/sdk/server/stdio.js");
async function runStdio(server) {
  const transport2 = new import_stdio.StdioServerTransport();
  await server.connect(transport2);
}

// src/transport/http.ts
var import_streamableHttp = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
var import_http = require("http");
var PORT = parseInt(process.env.RYMI_MCP_PORT || "8787", 10);
async function runHttp() {
  const httpServer = (0, import_http.createServer)(async (req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    const authHeader = req.headers["authorization"] || "";
    const apiKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!apiKey) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing Authorization: Bearer <RYMI_API_KEY>" }));
      return;
    }
    const server = createServer(apiKey);
    const transport2 = new import_streamableHttp.StreamableHTTPServerTransport({ sessionIdGenerator: void 0 });
    await server.connect(transport2);
    await transport2.handleRequest(req, res);
  });
  httpServer.listen(PORT, () => {
    process.stderr.write(`Rymi MCP HTTP server listening on port ${PORT}
`);
  });
}

// src/index.ts
var transport = process.argv.includes("--transport") ? process.argv[process.argv.indexOf("--transport") + 1] : "stdio";
if (transport === "http") {
  runHttp().catch((err) => {
    process.stderr.write(`Fatal: ${err.message}
`);
    process.exit(1);
  });
} else {
  const apiKey = process.env.RYMI_API_KEY || "";
  if (!apiKey) {
    process.stderr.write("Error: RYMI_API_KEY environment variable is required.\n");
    process.exit(1);
  }
  const server = createServer(apiKey);
  runStdio(server).catch((err) => {
    process.stderr.write(`Fatal: ${err.message}
`);
    process.exit(1);
  });
}
