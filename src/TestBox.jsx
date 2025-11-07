import { useEffect, useState } from "react";
import { recommendNext } from "./api/recommendation";


export default function TestBox() {

  const [item, setItem] = useState(null);
  
  useEffect(() => {
    async function fetchItem() {
      const item_data = await recommendNext("phuc");
      setItem(item_data);
    }
    console.log('Before fetching.');
    fetchItem();
    console.log('Done fetching.');
  }, []);

  if (!item) return <p>Fetching data...</p>;

  return (
    <p>{JSON.stringify(item)}</p>
  );
}
