import { Button, Title, Container } from "@mantine/core";
import { Component, ErrorInfo, ReactNode } from "react";
import { TextAnimate } from "@/animation/text-animation";
interface Props {
  children?: ReactNode;
  navigate?: (path: string) => void; // Add navigate as a prop
}
interface State {
  hasError: boolean;
}
class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  public static getDerivedStateFromError(_: Error): State {
    // Update state to show fallback UI
    return { hasError: true };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You can also log the error to an error reporting service
  }
  private handleGoHome = () => {
    if (this.props.navigate) {
      this.props.navigate("/"); // Navigate to the home page
    }
  };
  public render() {
    if (this.state.hasError) {
      return (
        <section className="h-screen flex justify-center items-center">
          <Container>
            <div className="text-center flex flex-col items-center dark:text-main">
              <Title size="2rem">
                <TextAnimate animation="slideDown">
                  Sahifada muammo bo'ldi
                  Sahifa muammo bo'ldi
                </TextAnimate>
              </Title>
              <Button
                style={{ marginTop: "10px" }} // Use inline styles for spacing
                variant="outline"
                color="green"
                onClick={this.handleGoHome} // Handle navigation on click
              >
                Bosh sahifaga qaytish
              </Button>
            </div>
          </Container>
        </section>
      ); // Fallback UI
    }
    return this.props.children;
  }
}
export default ErrorBoundary; // Wrap with withRouter for navigation support