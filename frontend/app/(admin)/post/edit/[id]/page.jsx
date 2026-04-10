// app/user/edit/[id]/page.jsx
import EditForm from './EditForm';

export default function EditPage({ params }) {
    return (
        <EditForm id={params.id} />

    );
}
