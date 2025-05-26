import { Button, Container, Title } from "@mantine/core";
import { TextAnimate } from "@/animation/text-animation";
import { useNavigate } from "react-router-dom";
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="h-screen flex justify-center items-center">
      <Container>
        <div className="text-center flex flex-col items-center dark:text-main">
          {/* <img className="md:w-80" src={notFound} alt="not found gif" /> */}
          <Title size="2rem">
            Sahifa Topilmadi.
            <TextAnimate animation="slideDown">404</TextAnimate>
          </Title>
          <Button
            onClick={() => navigate("/")}
            mt="10"
            variant="outline"
            color="green"
          >
            Bosh sahifaga qaytish.
          </Button>
        </div>
      </Container>
    </section>
  );
}
export default NotFoundPage;