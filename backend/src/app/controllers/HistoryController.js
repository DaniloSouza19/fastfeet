import { Op } from 'sequelize';
import Order from '../models/Order';

class HistoryController {
  async index(req, res) {
    const deliveries = await Order.findAll({
      where: {
        deliveryguy_id: req.params.id,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
    });

    return res.json(deliveries);
  }
}

export default new HistoryController();
