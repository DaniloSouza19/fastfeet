import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryguy from '../models/Deliveryguy';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async store(req, res) {
    /**
     * Schema validation
     */
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    /**
     * Check input validation
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    /**
     * Check if order exists
     */
    const orderExists = await Order.findByPk(req.params.id);

    if (!orderExists) {
      return res.status(400).json({ error: 'Order not found' });
    }

    const { description } = req.body;
    const { id: delivery_id } = req.params;

    const { id } = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json({
      id,
      description,
      delivery_id,
    });
  }

  async index(req, res) {
    const { page } = req.query;

    const deliveries = await DeliveryProblem.findAll({
      attributes: ['delivery_id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['id', 'product', 'start_date', 'end_date'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name', 'address', 'city'],
            },
            {
              model: Deliveryguy,
              as: 'deliveryguy',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;
    const { page } = req.query;

    /**
     * Check if Delivery Exists
     */
    const delivery = await Order.findByPk(id);

    if (!delivery) {
      res.status(400).json({ error: 'Delivery not found' });
    }

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['id', 'product', 'start_date', 'end_date'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name', 'address', 'city'],
            },
            {
              model: Deliveryguy,
              as: 'deliveryguy',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: ['created_at'],
    });

    res.json(problems);
  }

  async delete(req, res) {
    const { id } = req.params;

    /**
     * check problem exists
     */
    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res.status(400).json({ error: 'problem not found' });
    }

    const delivery = await Order.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryguy,
          as: 'deliveryguy',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    /**
     * Check if delivery is not canceled
     */
    if (delivery.canceled_at !== null) {
      return res.status(400).json({ error: 'Delivery alrealy canceled' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationMail.key, {
      delivery,
    });

    return res.json({ msg: 'delivery has been cancelled sucessfully' });
  }
}

export default new DeliveryProblemController();
