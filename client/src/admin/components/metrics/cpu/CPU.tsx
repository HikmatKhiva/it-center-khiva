import { Sparkline } from "@mantine/charts";
import { Card, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const CPU = () => {
  const [data, setData] = useState<number[]>([]);
  useEffect(() => {
    setInterval(() => {
      setData((prev) => [...prev, Math.floor(Math.random() * 100)]);
    }, 3000);
  }, []);
  return (
    <Card withBorder w={'50%'} h={200}>
      <Text>CPU</Text>
      <Sparkline
        w={'100%'}
        h={150}
        data={data}
        curveType="linear"
        color="pink"
        fillOpacity={0.29}
        strokeWidth={2.6}
      />
    </Card>
  );
};

export default CPU;
