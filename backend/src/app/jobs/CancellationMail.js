import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryguy.name} <${delivery.deliveryguy.email}>`,
      subject: 'Entrega de encomenda cancelada',
      template: 'cancellation',
      context: {
        deliveryguy: delivery.deliveryguy.name,
        idOrder: delivery.id,
        product: delivery.product,
      },
    });
  }
}

export default new CancellationMail();
