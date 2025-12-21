import { createNovaProxyHandler } from "@khaveeai/providers-nova/server";

const proxy = createNovaProxyHandler({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  const upgrade = req.headers.get("upgrade");

  if (upgrade === "websocket") {
    const { socket, response } = (req as any).socket;
    await proxy.handleUpgrade(req as any, socket, Buffer.alloc(0), () => {});
    return response;
  }

  return Response.json({ status: "ok" });
}

export const dynamic = "force-dynamic";
