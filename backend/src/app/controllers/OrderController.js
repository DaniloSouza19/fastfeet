import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryguy from '../models/Deliveryguy';
import Recipient from '../models/Recipient';
import File from '../models/File';

import NewOrderMail from '../jobs/NewOrderMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryguy_id: Yup.number().required(),
    });

    /**
     * Check req.body is valid shape
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { recipient_id, deliveryguy_id } = req.body;
    /**
     * Check if deliveryguy exists
     */
    const deliveryguyExists = await Deliveryguy.findByPk(deliveryguy_id);

    if (!deliveryguyExists) {
      return res.status(400).json({ error: 'Deliveryguy not found' });
    }

    /**
     * Check if recipient exists
     */
    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found ' });
    }

    const order = await Order.create(req.body);

    await Queue.add(NewOrderMail.key, {
      deliveryguyExists,
      order,
    });

    return res.json(order);
  }

  async index(req, res) {
    const { page } = req.query;

    const orders = await Order.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['start_date'],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },

        {
          model: Deliveryguy,
          as: 'deliveryguy',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },

        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'address', 'number'],
        },
      ],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryguy_id: Yup.number(),
    });

    /**
     * Check if req.body is valid schema
     */

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { recipient_id, deliveryguy_id } = req.body;
    /**
     * Check if deliveryguy exists
     */
    const deliveryguyExists = await Deliveryguy.findByPk(deliveryguy_id);

    if (!deliveryguyExists) {
      return res.status(400).json({ error: 'Deliveryguy not found' });
    }

    /**
     * Check if recipient exists
     */
    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found ' });
    }

    /**
     * Check Order Exists or is not canceled
     */
    const orderExists = await Order.findByPk(req.params.id);

    if (!orderExists || orderExists.canceled_at !== null) {
      return res.status(400).json({ error: 'Order not found' });
    }

    const order = await orderExists.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      attributes: ['id', 'product', 'canceled_at'],
      include: [
        {
          model: Deliveryguy,
          as: 'deliveryguy',
          attributes: ['id', 'name'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });

    /**
     * Check if order exists or is not canceled
     */
    if (!order || order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order not found' });
    }

    order.canceled_at = new Date();

    order.save();

    return res.status(200).json(order);
  }
}

export default new OrderController();
