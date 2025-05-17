import Head from 'next/head';
import React from 'react';

const ShippingPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy</title>
      </Head>

     <main className="px-4 py-10 pt-15 mt-10 md:px-10 lg:px-24 max-w-4xl mx-auto text-left">

        <h1>🚚 Shipping Policy</h1>
        <p><em>Last Updated: May 17, 2025</em></p>

        <section>
          <h2>1. International Shipping</h2>
          <p>
            For international buyers, orders are shipped and delivered through registered international courier companies
            and/or International Speed Post only.
          </p>
        </section>

        <section>
          <h2>2. Domestic Shipping</h2>
          <p>
            For domestic buyers, orders are shipped through registered domestic courier companies and/or Speed Post only.
          </p>
        </section>

        <section>
          <h2>3. Shipping Timeline</h2>
          <p>
            Orders are shipped within <strong>6-8 days</strong> from the date of order and payment or as per the delivery
            date agreed at the time of order confirmation.
          </p>
          <p>
            Delivery is subject to courier company/post office norms.
          </p>
        </section>

        <section>
          <h2>4. Liability</h2>
          <p>
            <strong>RITESH SANTRAM GHUMATKAR</strong> is not liable for any delay in delivery by the courier or postal
            authorities. Our responsibility ends when the consignment is handed over to them within the specified period.
          </p>
        </section>

        <section>
          <h2>5. Delivery Address</h2>
          <p>
            All orders will be delivered to the address provided by the buyer at the time of purchase.
          </p>
        </section>

        <section>
          <h2>6. Service Confirmation</h2>
          <p>
            Delivery of our services will be confirmed through your email address as specified during registration.
          </p>
        </section>

        <section>
          <h2>7. Support</h2>
          <p>
            For any issues related to our services, you may contact our helpdesk:
          </p>
          <ul>
            <li>📞 Phone: 8380075733</li>
            <li>📧 Email: <a href="mailto:riteshprintstudio@gmail.com">riteshprintstudio@gmail.com</a></li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default ShippingPolicyPage;
