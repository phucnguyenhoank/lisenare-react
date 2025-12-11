import { useEffect, useState } from "react";
import { apiCall } from "./api/client_test";

export default function TestBox() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      const c = await apiCall("/topics/all");
      setData(c);
    }
    fetchData();
  }, []);

  const formBody = new URLSearchParams({
    username: "phuc",
    password: "1234"
  })

  if (data){
    return <pre>{formBody.toString()}</pre>
    // return <pre>{JSON.stringify(data, null, 2)}</pre>
  }
  return <p>Hello</p>;
  
}
  