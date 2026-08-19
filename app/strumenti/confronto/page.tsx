import { redirect } from 'next/navigation';

export default function LegacyComparisonRedirect() {
  redirect('/cerca?intent=confronto');
}
