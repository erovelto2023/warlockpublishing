import { useEffect, useState } from "react";
import DirectoryPage from "@/components/DirectoryPage";
import directoryData from "@/data/binoid.json";

export default function Home() {
  const [data, setData] = useState(directoryData);

  useEffect(() => {
    // Data is loaded from JSON file
    setData(directoryData);
  }, []);
  return <DirectoryPage data={data} />;
}
