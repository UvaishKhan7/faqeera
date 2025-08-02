const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderConfirmationEmail = async (customerEmail, orderDetails) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Faqeera Store <onboarding@resend.dev>', // Do not change this in test mode
      to: [customerEmail],
      subject: `Order Confirmation - #${orderDetails.paymentDetails.razorpay_order_id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Hi there,</p>
        <p>We've received your order and will get it ready for shipment soon.</p>
        <h3>Order Summary:</h3>
        <ul>
          ${orderDetails.products.map(p => `<li>${p.name} (x${p.quantity}) - ₹${(p.price * p.quantity).toFixed(2)}</li>`).join('')}
        </ul>
        <p><strong>Total: ₹${orderDetails.totalAmount.toFixed(2)}</strong></p>
        <p>Thank you for shopping with Faqeera!</p>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent successfully:', data.id);
    }
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

const sendShippingConfirmationEmail = async (customerEmail, orderDetails) => {
  const trackingNumber = orderDetails.shippingInfo?.trackingNumber;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Faqeera Store <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `Your Faqeera Order has Shipped! - #${orderDetails.paymentDetails.razorpay_order_id}`,
      html: `
        <h1>Your order is on its way!</h1>
        <p>Hi there,</p>
        <p>Great news! Your order from Faqeera has been shipped and is heading your way.</p>

        ${trackingNumber ? `
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p>You can use this number to track your package with the courier service.</p>
        ` : `
          <p>You will receive tracking information in a separate email soon.</p>
        `}

        <h3>Order Summary:</h3>
        <ul>
          ${orderDetails.products.map(p => `<li>${p.name} (x${p.quantity})</li>`).join('')}
        </ul>
        <p>We can't wait for you to receive your items!</p>
      `,
    });

    if (error) {
      console.error('Error sending shipping email:', error);
    } else {
      console.log('Shipping confirmation email sent successfully:', data.id);
    }
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendShippingConfirmationEmail
};
