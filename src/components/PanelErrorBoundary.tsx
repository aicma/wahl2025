import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class PanelErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col gap-2 rounded-lg border border-destructive p-4">
          <p className="text-sm font-medium text-destructive">
            Fehler beim Laden des Gebiets
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {this.state.error.message}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
