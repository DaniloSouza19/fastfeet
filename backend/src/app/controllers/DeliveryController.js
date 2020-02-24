import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { page } = req.query;
    const deliveries = await Order.findAll({
      where: {
        deliveryguy_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'address',
            'address_2',
            'number',
            'state',
            'city',
            'postal_code',
          ],
        },
      ],
    });

    return res.json(deliveries);
  }
}

export default new DeliveryController();
