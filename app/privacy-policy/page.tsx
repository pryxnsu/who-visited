import { CONTACT_EMAIL } from '@/lib/constant';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy policy',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>

      <p className="text-black-500 mb-6 text-sm">Last updated: March 10, 2026</p>

      <p className="mb-4 text-black">
        This Privacy Policy explains how our analytics service collects, processes, and protects data when websites use
        our tracking technology.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Information We Collect</h2>

      <p className="mb-4 text-black">
        When a website integrates our analytics service, we collect limited information about website visitors in order
        to generate aggregated analytics statistics. The information collected may include:
      </p>

      <ul className="ml-6 list-disc space-y-2 text-black">
        <li>IP address (hashed before storage)</li>
        <li>Country and city derived from the IP address</li>
        <li>Browser type and operating system</li>
        <li>Visited pages and timestamps</li>
        <li>Referrer information</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold">IP Address Processing</h2>

      <p className="mb-4 text-black">
        To enhance visitor privacy, IP addresses are hashed before being stored in our systems. Raw IP addresses are not
        permanently stored. The hashed identifier may be used to estimate metrics such as unique visitors while
        preventing direct identification of individuals.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Cookies and Tracking</h2>

      <p className="mb-4 text-black">
        Our analytics system is designed to minimize invasive tracking. We aim to operate without using persistent
        cookies whenever possible. However, certain technical identifiers may be temporarily processed in order to
        generate accurate analytics statistics.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">How We Use Data</h2>

      <p className="mb-4 text-black">
        The collected data is used exclusively to provide analytics insights to website owners using our service. These
        insights may include visitor counts, traffic sources, page popularity, device statistics, and geographic trends.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Data Sharing</h2>

      <p className="mb-4 text-black">
        We do not sell, rent, or trade personal data. Analytics data collected through our platform is accessible only
        to the website owner using our service. We may process data using trusted infrastructure providers necessary to
        operate our service, such as hosting or cloud providers.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Data Retention</h2>

      <p className="mb-4 text-black">
        Analytics data is retained only for as long as necessary to provide analytics insights and maintain system
        functionality. We periodically review stored data and remove information that is no longer required.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Responsibilities of Website Owners</h2>

      <p className="mb-4 text-black">
        Website owners who use our analytics service are responsible for informing their visitors that analytics
        tracking is in use on their website. They are also responsible for ensuring compliance with applicable privacy
        and data protection laws in their jurisdiction.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Security</h2>

      <p className="mb-4 text-black">
        We take reasonable technical and organizational measures to protect analytics data from unauthorized access,
        alteration, or misuse. However, no system can guarantee absolute security.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Changes to This Policy</h2>

      <p className="mb-4 text-black">
        We may update this Privacy Policy from time to time to reflect improvements to our service or changes in legal
        requirements. Updates will be published on this page.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Contact</h2>

      <p className="mb-5 text-black">
        If you have questions about this Privacy Policy or how data is processed, please contact us at:
      </p>

      <Link href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-black underline-offset-1 hover:underline">
        {CONTACT_EMAIL}
      </Link>
    </main>
  );
}
