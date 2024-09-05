import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.replace("/")}>
            {/* npm i react-error-boundary
            Error boundaries are similar to try-catch blocks, but for React rendering. They allow us to handle JavaScript errors that occur specifically within the rendering logic of our components. While error boundaries are a valuable concept, using them can be challenging in React. Currently, they require class components and have a somewhat complex implementation. As a result, many developers opt for a third-party package called react-error-boundary which simplifies the process significantly.
            The react-error-boundary package provides a convenient component specifically designed for error boundaries. This component accepts two props: fallback and resetErrorBoundary. The fallback prop allows us to define what gets rendered when an error occurs within the wrapped component tree. The resetErrorBoundary prop provides a function that can be used to reset the error state of the boundary, potentially allowing the application to recover. To utilize this functionality, we would typically wrap our entire application with the ErrorBoundary component.
            It's important to note that error boundaries only catch errors during the rendering phase of React components. This means errors that occur in event handlers, effects, or asynchronous code won't be caught by an error boundary. */}
            <App/>
        </ErrorBoundary>
    </React.StrictMode>,
);

// npm run build