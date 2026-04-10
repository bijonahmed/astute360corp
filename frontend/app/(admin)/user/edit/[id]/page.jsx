// app/user/edit/[id]/page.jsx
import EditUserForm from './EditUserForm';

export default function EditUserPage({ params }) {
    return (
        <EditUserForm id={params.id} />

    );
}
