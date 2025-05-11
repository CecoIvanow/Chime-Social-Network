export default function LoadingSpinner() {
    return <>
        <div
            className="loading-container"
            role="status"
            data-testId="loading-container"
        >
            <div
                className="loading-spinner primary"
                data-testId="loading-spinner"
            ></div>
        </div>
    </>
}