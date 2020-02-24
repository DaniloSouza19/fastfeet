import File from '../models/File';
import Order from '../models/Order';

class EndDeliveryController {
  async update(req, res) {
    const { originalname: name, filename: path } = req.file;

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
    if (orderExists.start_date === null) {
      return res
        .status(400)
        .json({ error: "order hasn't left for delivery yet" });
    }

    /**
     * check if order already delivered
     */
    if (orderExists.end_date !== null) {
      return res.status(400).json({ error: 'The Order already delivered' });
    }

    const { id: signature_id, url } = await File.create({
      name,
      path,
    });

    /**
     * update Order
     */

    const { id, product, end_date } = await orderExists.update({
      signature_id,
      end_date: new Date(),
    });

    return res.json({ id, product, end_date, signature_id, url });
  }
}

export default new EndDeliveryController();
