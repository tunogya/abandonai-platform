# abandon.ai

```sql
--CREATE EXTENSION IF NOT EXISTS vector;
--SELECT * FROM pg_extension WHERE extname = 'vector';

CREATE TABLE WKIL59RYIS.bedrock_knowledge_base (
id UUID PRIMARY KEY,
embedding VECTOR(1536),
chunks TEXT,
metadata JSONB
);

CREATE INDEX idx_documents_vector ON WKIL59RYIS.bedrock_knowledge_base USING ivfflat (embedding vector_cosine_ops);
```
