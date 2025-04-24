// lists all diary entries for a user

import React, { useEffect, useState } from "react";
import api from "../services/api";

const DiaryList = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data } = await api.get("/diary");
      setEntries(data);
    };
    fetchEntries();
  }, []);

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry._id}>{entry.title}</li>
      ))}
    </ul>
  );
};

export default DiaryList;
