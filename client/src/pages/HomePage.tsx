import { lazy, Suspense } from "react";
<<<<<<< HEAD
import { TextAnimate } from "@/animation/text-animation";
// import TeacherSection from "../section/TeacherSection";
import FaqSection from "@/section/FaqSection";
// import CourseSection from "../section/CourseSection";
=======
>>>>>>> 7a0bcf3f091205cce6167587304d7f03d3c1de0e
const Spline = lazy(() => import("@splinetool/react-spline"));
import { Container } from "@mantine/core";
import { TextAnimate } from "../animation/text-animation";
import FaqSection from "../section/FaqSection";
const HomePage = () => {
  const urlCube = "https://prod.spline.design/xqVtEciHtU0-h29j/scene.splinecode";
  return (
    <>
      <section className="h-[calc(100vh-60px)] flex items-center justify-center">
        <Container size="xl" className="h-full w-full">
          <div className="flex justify-between h-full items-center w-full flex-wrap">
            <h2 className="md:text-5xl  text-3xl flex-grow">
              Sizning <span className="text-[#7DBA28]">IT </span> karyerangizni
              <br />{" "}
              <TextAnimate animation="blurInUp" by="character">
                shu yerdan boshlang!
              </TextAnimate>
            </h2>
            <Suspense fallback={<h2>Loading</h2>}>
              <Spline
                style={{ width: "50%", height: "100%" }}
                className="lg:flex hidden h-full md:w-1/2 w-full"
                scene={urlCube}
              />
            </Suspense>
          </div>
        </Container>
      </section>
      <FaqSection />
    </>
  );
};
export default HomePage;