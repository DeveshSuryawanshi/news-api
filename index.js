import express from 'express';
import cors from 'cors';
import newsRouter from './src/routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/news', newsRouter);
app.use("/", (req, res) => {
  res.send("Welcome to the News API");
});

export const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}