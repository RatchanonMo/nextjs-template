import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantClient = new QdrantClient({
  url: process.env.NEXT_PUBLIC_QDRANT_URL || "http://localhost:6333", 
  apiKey: process.env.NEXT_PUBLIC_QDRANT_API_KEY,
});

export default qdrantClient;
