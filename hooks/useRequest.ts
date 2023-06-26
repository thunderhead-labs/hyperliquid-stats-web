import { useState, useEffect, useContext } from "react";
import { DataContext } from "../contexts/data";

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useRequest(url: string, defaultValue: any, key?: string, dontRefetch?: boolean) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState(defaultValue);
  const dataContext = useContext(DataContext);
  const urlHasParams = url.indexOf("?") !== -1;

  let params = '';
  if (dataContext.dates.from) {
    if (!urlHasParams) { params += '?' }
    if (urlHasParams) { params += '&' }
    params += `start_date=${dataContext.dates.from}`;
  }
  if (dataContext.dates.to) {
    params += `&end_date=${dataContext.dates.to}`;
  }

  const init = async () => {
    try {
        setLoading(true)
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}${url}${params}`);
        if (key && data[key]) {
            setData(data[key])
        } else {
            setData(data)
        }
      } catch (error) {
        console.error(error)
        setError(error)
      }
      setLoading(false)
  }

  useEffect(() => {
    init();
  }, [url])

  useEffect(() => {
    if (dontRefetch) return;
    init();
  }, [dataContext.dates.from, dataContext.dates.to])

  return [data, loading, error]
}