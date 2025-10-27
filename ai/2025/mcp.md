```ts
import { Elysia } from "elysia";
import { v4 as uuidv4 } from "uuid";

type Tool = {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
        additionalProperties?: boolean;
        $schema?: string;
    };
    run: (input?: any) => Promise<any>;
};

const tools: Tool[] = [
    {
        name: "perbekal_darmasaba",
        description: "Mengembalikan nama perbekal darmasaba",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: true,
            $schema: "http://json-schema.org/draft-07/schema#",
        },
        run: async () => ({ perbekal_darmasaba: "malik kurosaki" }),
    },
    {
        name: "uuid",
        description: "Menghasilkan UUID v4 unik.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: true,
            $schema: "http://json-schema.org/draft-07/schema#",
        },
        run: async () => ({ uuid: uuidv4() }),
    },
    {
        name: "echo",
        description: "Mengembalikan data yang dikirim.",
        inputSchema: {
            type: "object",
            properties: {
                input: {
                    type: "string",
                    description: "Message to echo back",
                },
            },
            required: ["input"],
            additionalProperties: true,
            $schema: "http://json-schema.org/draft-07/schema#",
        },
        run: async (input) => ({ echo: input }),
    },
    {
        name: "Calculator",
        description: "Useful for getting the result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by a simple calculator.",
        inputSchema: {
            type: "object",
            properties: {
                input: {
                    type: "string",
                },
            },
            required: ["input"],
            additionalProperties: true,
            $schema: "http://json-schema.org/draft-07/schema#",
        },
        run: async (input) => {
            try {
                // Simple math evaluation (be careful in production!)
                const result = Function(`"use strict"; return (${input.input})`)();
                return { result: String(result) };
            } catch (error: any) {
                throw new Error(`Invalid expression: ${error.message}`);
            }
        },
    },
];

// =====================
// MCP Protocol Types
// =====================
type JSONRPCRequest = {
    jsonrpc: "2.0";
    id: string | number;
    method: string;
    params?: any;
};

type JSONRPCResponse = {
    jsonrpc: "2.0";
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
};

// =====================
// MCP Handler
// =====================
function handleMCPRequest(request: JSONRPCRequest): JSONRPCResponse {
    const { id, method, params } = request;

    switch (method) {
        case "initialize":
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    protocolVersion: "2024-11-05",
                    capabilities: {
                        tools: {},
                    },
                    serverInfo: {
                        name: "elysia-mcp-server",
                        version: "1.0.0",
                    },
                },
            };

        case "tools/list":
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    tools: tools.map(({ name, description, inputSchema }) => ({
                        name,
                        description,
                        inputSchema,
                    })),
                },
            };

        case "tools/call":
            const toolName = params?.name;
            const tool = tools.find((t) => t.name === toolName);

            if (!tool) {
                return {
                    jsonrpc: "2.0",
                    id,
                    error: {
                        code: -32601,
                        message: `Tool '${toolName}' not found`,
                    },
                };
            }

            try {
                // Note: This is synchronous for simplicity
                // In real implementation, you'd need to handle async properly
                let result: any;
                tool.run(params?.arguments || {}).then((r) => (result = r));

                return {
                    jsonrpc: "2.0",
                    id,
                    result: {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result || { pending: true }),
                            },
                        ],
                    },
                };
            } catch (error: any) {
                return {
                    jsonrpc: "2.0",
                    id,
                    error: {
                        code: -32603,
                        message: error.message,
                    },
                };
            }

        case "ping":
            return {
                jsonrpc: "2.0",
                id,
                result: {},
            };

        default:
            return {
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32601,
                    message: `Method '${method}' not found`,
                },
            };
    }
}

async function handleMCPRequestAsync(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    const { id, method, params } = request;

    if (method === "tools/call") {
        const toolName = params?.name;
        const tool = tools.find((t) => t.name === toolName);

        if (!tool) {
            return {
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32601,
                    message: `Tool '${toolName}' not found`,
                },
            };
        }

        try {
            const result = await tool.run(params?.arguments || {});
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result),
                        },
                    ],
                },
            };
        } catch (error: any) {
            return {
                jsonrpc: "2.0",
                id,
                error: {
                    code: -32603,
                    message: error.message,
                },
            };
        }
    }

    // For other methods, use sync handler
    return handleMCPRequest(request);
}

// =====================
// Server Initialization
// =====================
export const MCPRoute = new Elysia()
    // =====================
    // MCP HTTP Streamable Endpoint
    // =====================
    .post("/mcp/:sessionId", async ({ params, request, set }) => {
        set.headers["Content-Type"] = "application/json";
        set.headers["Access-Control-Allow-Origin"] = "*";

        // Optional: Check authorization
        // if (!isAuthorized(request.headers)) {
        //     set.status = 401;
        //     return { error: "Unauthorized" };
        // }

        try {
            const body = await request.json();

            // Handle single request
            if (!Array.isArray(body)) {
                const response = await handleMCPRequestAsync(body as JSONRPCRequest);
                return response;
            }

            // Handle batch requests
            const responses = await Promise.all(
                body.map((req) => handleMCPRequestAsync(req as JSONRPCRequest))
            );
            return responses;
        } catch (error: any) {
            set.status = 400;
            return {
                jsonrpc: "2.0",
                id: null,
                error: {
                    code: -32700,
                    message: "Parse error",
                    data: error.message,
                },
            };
        }
    })

    // =====================
    // Simple tools list endpoint (for debugging)
    // =====================
    .get("/mcp/:sessionId/tools", ({ set }) => {
        set.headers["Access-Control-Allow-Origin"] = "*";
        return {
            data: tools.map(({ name, description, inputSchema }) => ({
                name,
                value: name,
                description,
                inputSchema,
            })),
        };
    })

    // =====================
    // Session Status
    // =====================
    .get("/mcp/:sessionId/status", ({ params, set }) => {
        set.headers["Access-Control-Allow-Origin"] = "*";
        return {
            sessionId: params.sessionId,
            status: "active",
            timestamp: Date.now(),
        };
    })

    // =====================
    // Health Check
    // =====================
    .get("/health", ({ set }) => {
        set.headers["Access-Control-Allow-Origin"] = "*";
        return {
            status: "ok",
            timestamp: Date.now(),
            tools: tools.length,
        };
    })

    // =====================
    // CORS preflight
    // =====================
    .options("/mcp/:sessionId", ({ set }) => {
        set.headers["Access-Control-Allow-Origin"] = "*";
        set.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-API-Key";
        set.status = 204;
        return "";
    })

    .options("/mcp/:sessionId/tools", ({ set }) => {
        set.headers["Access-Control-Allow-Origin"] = "*";
        set.headers["Access-Control-Allow-Methods"] = "GET,OPTIONS";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-API-Key";
        set.status = 204;
        return "";
    });

```
