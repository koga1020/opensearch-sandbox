import { serve } from '@hono/node-server';
import { Client } from '@opensearch-project/opensearch';
import { Hono } from 'hono';

const app = new Hono();

const client = new Client({
  node: 'http://localhost:9200',
});

app.get('/', async (c) => {
  const health = await client.cluster.health();
  return c.json(health.body);
});
app.get('/search', async (c) => {
  const category = c.req.query('q')
  const result = await client.search({
    index: 'opensearch_dashboards_sample_data_ecommerce',
    body: {
      query: {
        match: {
          category: {
            query: 'M',
            minimum_should_match: '1%'
          }
          
        },
        

      }
    }
  });
  return c.json(result);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
