export default function LoadingSpinner() {
    return <>
        <div
            className="loading-container"
            role="status"
            data-testid="loading-container"
        >
            <div
                className="loading-spinner primary"
                data-testid="loading-spinner"
            ></div>
        </div>
    </>
}