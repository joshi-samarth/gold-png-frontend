export function Spinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-border"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue animate-spin"></div>
            </div>
        </div>
    );
}
