import express from 'express';
import cors from 'cors';

import powerRouter from '../routers/power.router.js';
import breedRouter from '../routers/breed.router.js';
import magicRouter from '../routers/magic.router.js';
import typeWarriorRouter from '../routers/typeWarrior.router.js';
import playerRouter from '../routers/player.router.js';
import roleRouter from '../routers/role.router.js';
import statusRouter from '../routers/status.router.js';
import warriorRouter from '../routers/warrior.router.js';
import warriorPowerRouter from '../routers/warriorPower.router.js';
import userRouter from '../routers/user.router.js';
import tokenRouter from '../routers/token.router.js';
import gameRouter from '../routers/game.router.js';
import gamePlayerRouter from '../routers/gamePlayer.router.js';
import warriorsPlayerRouter from '../routers/warriorsPlayer.router.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', powerRouter);
app.use('/api', breedRouter);
app.use('/api', magicRouter);
app.use('/api', typeWarriorRouter);
app.use('/api',playerRouter);
app.use('/api', roleRouter);
app.use('/api', statusRouter);
app.use('/api', warriorRouter);
app.use('/api', warriorPowerRouter);
app.use('/api', userRouter);
app.use('/api', tokenRouter);
app.use('/api', gameRouter);
app.use('/api', gamePlayerRouter);
app.use('/api', warriorsPlayerRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint losses'
    });
});

export default app;