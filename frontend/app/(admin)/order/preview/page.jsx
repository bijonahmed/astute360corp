"use client";
import { useSearchParams } from 'next/navigation';
import PreviewOrder from './[id]/PreviewOrder';
export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    return <PreviewOrder id={id} />;
}
