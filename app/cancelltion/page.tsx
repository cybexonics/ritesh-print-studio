import Head from 'next/head';
import React from 'react';

const CancellationPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cancellation & Refund Policy</title>
      </Head>

      <main className="px-4 py-10 md:px-10 lg:px-24 max-w-4xl mx-auto mt-10 text-left">
        <h1 className="text-center text-2xl font-semibold mb-4">❌ Cancellation & Refund Policy</h1>
        <p><em>Last Updated: May 17, 2025</em></p>

        <section className="mt-6">
          <p>
            <strong>RITESH SANTRAM GHUMATKAR</strong> believes in helping its customers as far as possible and follows a liberal cancellation policy. Below are the terms governing cancellation and refunds:
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">1. Order Cancellation</h2>
          <ul className="list-disc ml-5 mt-2">
            <li>Cancellations are accepted only if requested within <strong>1–2 days</strong> of placing the order.</li>
            <li>Requests may not be entertained if the order has already been processed or shipped to vendors/merchants.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">2. Exceptions</h2>
          <ul className="list-disc ml-5 mt-2">
            <li>No cancellations are accepted for <strong>perishable goods</strong> such as flowers or eatables.</li>
            <li>Refunds/replacements may be considered if the customer provides proof that the delivered product was of poor quality.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">3. Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please report it to our Customer Service Team within <strong>1–2 days</strong> of receipt. The request will be considered only after the merchant/vendor inspects and confirms the issue.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">4. Product Mismatch or Dissatisfaction</h2>
          <p>
            If the product received does not match the listing or your expectations, contact our support within <strong>1–2 days</strong> of delivery. We will evaluate the complaint and respond with a resolution.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">5. Manufacturer Warranty Claims</h2>
          <p>
            For products covered under a manufacturer warranty, please direct your complaint to the manufacturer directly.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">6. Refunds</h2>
          <p>
            If a refund is approved by <strong>RITESH SANTRAM GHUMATKAR</strong>, it will be processed within <strong>6–8 business days</strong> to the original payment method.
          </p>
        </section>
      </main>
    </>
  );
};

export default CancellationPolicyPage;
