import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    /*
     * data input Schema Validation
     *
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.string().required(),
      address_2: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      postal_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validations fails' });
    }

    const {
      id,
      name,
      address,
      number,
      address_2,
      state,
      city,
      postal_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      address,
      number,
      address_2,
      state,
      city,
      postal_code,
    });
  }

  async update(req, res) {
    /*
     * data input Schema Validation
     *
     */
    const schema = Yup.object().shape({
      name: Yup.string(),
      address: Yup.string(),
      number: Yup.string(),
      address_2: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      postal_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validations fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const {
      name,
      address,
      number,
      address_2,
      state,
      city,
      postal_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      address,
      number,
      address_2,
      state,
      city,
      postal_code,
    });
  }
}

export default new RecipientController();
