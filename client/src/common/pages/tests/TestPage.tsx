// import TestCreate from "@/common/components/test/TestCreate";
import TestCreator from "@/common/components/test/TestCreate2.js";
// import TestCreate3 from "@/common/components/test/TestCreate3";
import { Divider } from "@mantine/core";
// import React from "react";

const TestPage = () => {
  return (
    <div>
      TestPage
      {/* <TestCreate /> */}
      <Divider my={10} />
      {/* <CreateQuestion /> */}
      {/* <TestList /> */}
      <TestCreator  />
      {/* <TestCreate3 /> */}
    </div>
  );
};

export default TestPage;
