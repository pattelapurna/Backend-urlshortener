import express from 'express';
import userInfo from "user-info-logger/index.js"
const data = userInfo()

const app = express();
const PORT = 8000;

app.get('/', (_req, res) => {
  console.log(data)
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
