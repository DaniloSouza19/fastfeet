import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'newOrderMail';
  }

  async handle({ data }) {
    const { deliveryguyExists, order } = data;

    await Mail.sendMail({
      to: `${deliveryguyExists.name} <${deliveryguyExists.email}`,
      subject: 'Encomenda disponivel para retirada: ',
      template: 'newOrder',
      context: {
        deliveryguy: deliveryguyExists.name,
        product: order.product,
      },
    });
  }
}

export default new NewOrderMail();
