import { useLocation, Navigate } from 'react-router-dom';
import MemeEditor from '../components/MemeEditor';

const Editor = () => {
    const location = useLocation();
    const template = location.state?.template;

    if (!template) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="py-4">
            <MemeEditor template={template} />
        </div>
    );
};

export default Editor;
