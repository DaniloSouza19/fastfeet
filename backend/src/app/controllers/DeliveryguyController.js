import * as Yup from 'yup';
import Deliveryguy from '../models/Deliveryguy';
import File from '../models/File';

class DeliveryguyController {
  async index(req, res) {
    const deliveryguys = await Deliveryguy.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveryguys);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    /**
     * Check req.body is valid
     */
    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check Deliveryguy exists
     */

    const deliveryguyExists = await Deliveryguy.findOne({
      where: { email: req.body.email },
    });

    if (deliveryguyExists) {
      return res.status(400).json({ error: 'user already exists' });
    }

    const { id, name, email, avatar_id } = await Deliveryguy.create(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    /**
     * Check req.body is valid
     */
    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if req.id exists
     */
    const deliveryguy = await Deliveryguy.findByPk(req.params.id);

    if (!deliveryguy) {
      return res.status(400).json({ error: 'user not found' });
    }

    /**
     * Chek email exists
     */
    const { email } = req.body;

    if (email && email !== deliveryguy.email) {
      const deliveryguyExists = await Deliveryguy.findOne({ where: { email } });

      if (deliveryguyExists) {
        return res.status(400).json({ error: 'User Already exists' });
      }
    }

    const { id, name } = await deliveryguy.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const deliveryguy = await Deliveryguy.findByPk(req.params.id);

    /**
     * check if deliveryguy exists
     */
    if (!deliveryguy) {
      return res.status(400).json({ error: 'user not found' });
    }

    await deliveryguy.destroy();

    return res.status(200).json();
  }
}

export default new DeliveryguyController();
