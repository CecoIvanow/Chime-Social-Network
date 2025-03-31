import { Component } from 'react'
import ErrorMessage from './error-message/ErrorMessage'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hasError: false,
        }
    }

    static getDerivedStateFromError() {
        return {
            hasError: true
        }
    }


    render() {
        if (this.state.hasError) {
            return <ErrorMessage />
        }

        return this.props.children
    }
}