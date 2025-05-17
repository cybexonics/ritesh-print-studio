import Head from 'next/head';
import React from 'react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions</title>
      </Head>

      <main className="px-4 py-10 mt-10 md:px-10 lg:px-24 max-w-4xl mx-auto text-left">
        <h1 className="text-center text-2xl font-semibold mb-4">📜 Terms and Conditions</h1>
        <p><em>Last Updated: May 17, 2025</em></p>

        <section className="mt-6">
          <p>
            For the purpose of these Terms and Conditions, the terms <strong>"we", "us", "our"</strong> refer to <strong>RITESH SANTRAM GHUMATKAR</strong>, whose registered office is at Tandulwadi, Shelke Wasti, Baramati, Tandulwadi, Pune 413102. The terms <strong>"you", "your", "user", "visitor"</strong> refer to any individual or legal entity visiting our website and/or purchasing from us.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">1. Use of Website & Content</h2>
          <p>
            Your use of the website and/or purchase from us are governed by these Terms and Conditions. The contents of this website may change without notice.
          </p>
          <p>
            We and third parties do not provide any warranty or guarantee for the accuracy, timeliness, performance, completeness or suitability of the information and materials found on this site for any particular purpose.
          </p>
          <p>
            You acknowledge such materials may contain inaccuracies or errors and we exclude liability for these to the fullest extent permitted by law.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">2. User Responsibility</h2>
          <p>
            Your use of information or materials on this website and/or product pages is entirely at your own risk. It is your responsibility to ensure that any products, services, or information available meet your specific needs.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">3. Intellectual Property</h2>
          <p>
            This website contains material owned or licensed by us, including but not limited to design, layout, look, appearance, and graphics. Reproduction is prohibited unless in accordance with the copyright notice.
          </p>
          <p>
            All trademarks not owned by or licensed to us are acknowledged on the site.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">4. Unauthorized Use</h2>
          <p>
            Unauthorized use of our content may give rise to a claim for damages and/or be a criminal offense.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">5. External Links</h2>
          <p>
            From time to time, this website may include links to other websites. These links are provided for your convenience. Creating a link to our website without written consent from RITESH SANTRAM GHUMATKAR is prohibited.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">6. Governing Law</h2>
          <p>
            Any dispute arising from use of our website or purchase from us will be governed by the laws of India.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg">7. Transaction Authorization</h2>
          <p>
            We are not liable for any loss or damage resulting from declined transaction authorization due to the cardholder exceeding preset limits agreed with our acquiring bank.
          </p>
        </section>
      </main>
    </>
  );
};

export default TermsAndConditionsPage;
