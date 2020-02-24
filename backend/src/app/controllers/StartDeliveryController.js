import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Order from '../models/Order';

class StartDeliveryController {
  async update(req, res) {
    const { deliveryguyId, orderId } = req.params;

    /**
     * Check if order exists
     */
    const orderExists = await Order.findOne({
      where: {
        id: orderId,
        deliveryguy_id: deliveryguyId,
        canceled_at: null,
      },
    });

    if (!orderExists) {
      return res.status(400).json({ error: 'Order not found' });
    }

    /**
     * check if order already left for delivery
     */
    if (orderExists.start_date !== null) {
      return res.status(400).json({ error: 'order already left for delivery' });
    }

    /**
     * Check if the delivery guy made five withdrawals
     */
    const orders = await Order.findAll({
      where: {
        deliveryguy_id: deliveryguyId,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (orders.length > 5) {
      return res.status(401).json({
        error: 'You can not make more than five withdrawals per day ',
      });
    }

    /**
     * Check if it is a valid time to work
     */
    const startHour = setMinutes(setHours(startOfDay(new Date()), 8), 0);
    const endHour = setMinutes(setHours(startOfDay(new Date()), 18), 0);

    if (isBefore(new Date(), startHour) || isAfter(new Date(), endHour)) {
      return res
        .status(401)
        .json({ error: 'Widhdrawals outside working hours are not allowed' });
    }

    orderExists.start_date = new Date();
    const { id, product, start_date } = await orderExists.save();

    return res.json({ id, product, start_date });
  }
}

export default new StartDeliveryController();
