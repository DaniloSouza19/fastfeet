import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryguyController from './app/controllers/DeliveryguyController';

import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliveryguys', DeliveryguyController.store);
routes.get('/deliveryguys', DeliveryguyController.index);
routes.put('/deliveryguys/:id', DeliveryguyController.update);
routes.delete('/deliveryguys/:id', DeliveryguyController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
