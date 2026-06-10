"use client";
import { useSearchParams } from 'next/navigation';
import EditForm from './[id]/EditForm';
export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    return <EditForm id={id} />;
}