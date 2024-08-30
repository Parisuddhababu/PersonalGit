import React from 'react'

class ErrorBoundary extends React.Component {
    // @ts-ignore
    constructor(props) {
        super(props)
        this.state = { hasError: false, error_message: false }
    }

    static getDerivedStateFromError(error: any) {
        if ('serviceWorker' in navigator) {
            caches
                .keys()
                .then((cacheNames) =>
                    cacheNames.forEach((cacheName) => caches.delete(cacheName))
                )
        }
        return { hasError: true, error_message: error }
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.log({ error, errorInfo })
    }

    render() {
        // @ts-ignore
        if (this.state.hasError) {
            const errormessage =
                'Something went wrong, please reload the page or click on try again.'
            const tryagain = 'Try again?'
            const label = 'try again'
            return (
                <div className="text-center px-5 h-screen flex flex-col justify-center">
                    <p className="font-medium text-base text-p-4 pb-3">
                        {' '}
                        {errormessage}{' '}
                    </p>
                    <button
                        aria-label={label}
                        type="button"
                        className="button button-primary"
                        onClick={() => location.reload()}
                    >
                        {tryagain}
                    </button>
                </div>
            )
        }
        // @ts-ignore
        return this.props.children
    }
}

export default ErrorBoundary
