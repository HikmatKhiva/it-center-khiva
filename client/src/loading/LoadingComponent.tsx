import { LoadingOverlay } from "@mantine/core";
const LoadingComponent = () => {
  return (
    <div className="max-h-screen overflow-hidden">
      <LoadingOverlay
        loaderProps={{ color: "#7DBA28", type: "bars" }}
        overlayProps={{ radius: "sm", blur: 1 }}
        zIndex={1000}
        visible={true}
      />
    </div>
  );
};
export default LoadingComponent;