import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryguyController from './app/controllers/DeliveryguyController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import EndDeliveryController from './app/controllers/EndDeliveryController';
import HistoryController from './app/controllers/HistoryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/**
 * Deliveries to be made
 */
routes.get('/deliveryguys/:id/deliveries', DeliveryController.index);

/**
 * Start delivery
 */
routes.put(
  '/deliveryguys/:deliveryguyId/deliveries/:orderId',
  StartDeliveryController.update
);
/**
 * End Delivery
 */
routes.put(
  '/deliveryguys/:deliveryguyId/deliveries/:orderId/end',
  upload.single('signature'),
  EndDeliveryController.update
);

/**
 * Delivery Problems
 */
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

/**
 * History of deliveries to deliveryguy
 */
routes.get('/deliveryguys/:id/history', HistoryController.index);

/**
 * Routes with auth
 */
routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

/**
 * Crud Deliveryguys
 */
routes.post('/deliveryguys', DeliveryguyController.store);
routes.get('/deliveryguys', DeliveryguyController.index);
routes.put('/deliveryguys/:id', DeliveryguyController.update);
routes.delete('/deliveryguys/:id', DeliveryguyController.delete);

/**
 * Crud Orders
 */
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

/**
 * Delivery problems routes
 */
routes.get('/delivery/:id/problems', DeliveryProblemController.show);
routes.get('/deliveries/problems', DeliveryProblemController.index);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

/**
 * Files route
 */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
