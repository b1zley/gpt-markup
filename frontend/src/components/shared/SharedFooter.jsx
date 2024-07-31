/**
 * `SharedFooter` is a functional component that renders a footer section for the application.
 * It provides a consistent footer layout with minimal content and styling.
 *
 * @component
 * @returns {JSX.Element} The `SharedFooter` component.
 *
 * @example
 * <SharedFooter />
 */
const SharedFooter = () => {
    return (
        <footer className="footer mt-auto py-3 bg-light " style={{'minHeight':'10vh'}}>
            <div className="container text-center">
                <span className="text-muted">Your footer content here</span>
            </div>
        </footer>
    )
}

export default SharedFooter