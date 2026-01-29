import express from 'express';
import cors from 'cors';
import interventionsRouter from './routes/interventions'; // make sure path is correct

const app = express();

app.use(cors());
app.use(express.json());

// This must be here
app.use('/api/interventions', interventionsRouter);

app.listen(5000, () => console.log('Server running on port 5000'));
