# Nui Coding Challenge

1. Start the API server:

   ```
   npm start --workspace=server
   ```

2. Retrieve the next question from the `/next-question` endpoint. It expects the
   request body:

   ```json
   {
     "answers": [{ "key": "Arbeit", "result": "0" }]
   }
   ```

   If the `answers` array is empty, the first question will be provided.

3. If all the necessary questions are answered, the API will respond with the
   list of services.
   ```json
   {
     "answers": [
        { "key": "Arbeit", "result": "0" },
        ...
        ...
        { "key": "Situation", "result": "alleine" },
     ]
   }
   ```
   Response:
   ```json
   {
     "services": ["A", "B", "C"]
   }
   ```

## Tests

```bash
npm test --workspace=server
```

See [test file](https://github.com/mcchrish/nui_20231209/blob/main/server/tests/api.spec.ts) for all the tests.
