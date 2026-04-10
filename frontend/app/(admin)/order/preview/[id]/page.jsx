// app/user/edit/[id]/page.jsx
import EditForm from './PreviewOrder';

export default function EditPage({ params }) {
    return (
        <EditForm id={params.id} />

    );
}
