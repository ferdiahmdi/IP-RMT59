import { useCallback, useEffect, useState } from "react";
import baseURL from "../helpers/http";
import { useParams } from "react-router";

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const { collectionId, userId } = useParams();

  const fetchEntries = useCallback(async () => {
    try {
      const res = await baseURL.get(`/collections/${userId}/${collectionId} `, {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });

      const data = res.data;
      console.log(data);

      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  }, [collectionId, userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return <div></div>;
};

export default Entries;
