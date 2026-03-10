import { CONTACT_EMAIL } from '@/lib/constant';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>

      <p className="text-black-500 mb-6 text-sm">Last updated: March 10, 2026</p>

      <p className="mb-4 text-black">
        These Terms of Service govern your use of our analytics platform. By accessing or using the service, you agree
        to be bound by these terms.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Description of Service</h2>

      <p className="mb-4 text-black">
        Our platform provides website analytics tools that allow website owners to understand visitor behavior, traffic
        sources, and usage patterns. The service is intended to provide aggregated statistics and insights about website
        traffic.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">User Responsibilities</h2>

      <p className="mb-4 text-black">
        Users of our service are responsible for ensuring that their use of the analytics platform complies with
        applicable laws and regulations, including privacy and data protection laws.
      </p>

      <p className="mb-4 text-black">
        Website owners who implement our analytics tracking script must inform their website visitors about analytics
        tracking and provide appropriate privacy disclosures where required by law.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Prohibited Uses</h2>

      <p className="mb-4 text-black">
        You agree not to use the service for any unlawful purposes or in a way that could harm the service or other
        users. This includes but is not limited to:
      </p>

      <ul className="ml-6 list-disc space-y-2 text-black">
        <li>Attempting to disrupt or overload the service</li>
        <li>Using the platform for illegal activities</li>
        <li>Collecting personal data in violation of privacy laws</li>
        <li>Attempting to reverse engineer or exploit the platform</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Service Availability</h2>

      <p className="mb-4 text-black">
        We strive to keep the analytics service available and reliable, but we do not guarantee uninterrupted
        availability. The service may be updated, modified, or temporarily unavailable due to maintenance or technical
        issues.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Limitation of Liability</h2>

      <p className="mb-4 text-black">
        The service is provided {'as is'} without warranties of any kind. We are not liable for any damages or losses
        resulting from the use or inability to use the analytics platform.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Termination</h2>

      <p className="mb-4 text-black">
        We reserve the right to suspend or terminate access to the service if users violate these terms or misuse the
        platform.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Changes to Terms</h2>

      <p className="mb-4 text-black">
        We may update these Terms of Service from time to time. Continued use of the service after updates constitutes
        acceptance of the revised terms.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Contact</h2>

      <p className="mb-5 text-black">If you have questions about these Terms of Service, please contact us.</p>
      <Link href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-black underline-offset-1 hover:underline">
        {CONTACT_EMAIL}
      </Link>
    </main>
  );
}
