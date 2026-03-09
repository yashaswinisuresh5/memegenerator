import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <Loader2 className="h-10 w-10 text-brand-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">{message}</p>
        </div>
    );
};

export default Loader;
