# abandon.ai

```sql
CREATE SCHEMA IF NOT EXISTS ${schemaName};
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;
CREATE TABLE IF NOT EXISTS ${schemaName}.bedrock_knowledge_base (
                                                                    id UUID PRIMARY KEY,
                                                                    chunks TEXT,
                                                                    metadata JSONB,
                                                                    embedding public.VECTOR(1536)
    );
CREATE INDEX IF NOT EXISTS idx_documents_vector
    ON ${schemaName}.bedrock_knowledge_base
    USING ivfflat (embedding public.vector_cosine_ops);
```
