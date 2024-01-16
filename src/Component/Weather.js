import React, { useState, useEffect } from "react";
import "./Weather.css";
import {apiKey} from './KeyApi.js';
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { BeatLoader } from "react-spinners";

const Weather = () => {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

 // this Api is from https://developer.yle.fi/en/index.html 
 // i have used this Api to get the weather of the cities in Finland
 // i have used the Api key from the KeyApi.js file which is unique for each user 
  const Api = `https://external.api.yle.fi/v1/teletext/pages/406.json?${apiKey}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(Api);
        setCityData(response.data.teletext.page.subpage[0].content[0].line);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Fetch data every 10 minutes
    const intervalId = setInterval(fetchData, 600000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [Api]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Filter cities based on search input
  const filteredCities = cityData.slice(3).filter((item) => {
    const cityNameMatch = item.Text
      ? item.Text.trim().match(/[a-zA-ZäöüÄÖÜß]+/)
      : null;
    const cityName = cityNameMatch ? cityNameMatch[0].toLowerCase() : null;
    return cityName && cityName.includes(search.toLowerCase());
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {loading ? (
        <BeatLoader color={"#123abc"} loading={loading} size={100} />
      ) : (
        <>
          <TextField
            label="Search"
            variant="outlined"
            style={{ marginBottom: 20 }}
            value={search}
            onChange={handleSearch}
            sx={{ minWidth: "10rem" }}
          />

          {filteredCities.length > 0 && (
            <TableContainer sx={{ minWidth: 500 }}>
              <Table sx={{ minWidth: 500 }}>
                <TableHead sx={{ backgroundColor: "Black" }}>
                  <TableRow>
                    <TableCell style={{ color: "white" }}>Number</TableCell>
                    <TableCell style={{ color: "white" }}>City</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Viimeksi päivitetty
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Sää tänään</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredCities.map((item, index) => {
                    const cityNameMatch = item.Text
                      ? item.Text.trim().match(/[a-zA-ZäöüÄÖÜß]+/)
                      : null;
                    const dateTime = cityData[1].Text.trim()
                      .split(" ")
                      .slice(0, 3)
                      .join(" ");

                    const cityName = cityNameMatch ? cityNameMatch[0] : null;
                    const temperatureMatch = item.Text
                      ? item.Text.match(/-?\d+/)
                      : null;
                    const temperature = temperatureMatch
                      ? temperatureMatch[0]
                      : null;

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "gray" : "white",
                        }}
                      >
                        <TableCell style={{ color: "white" }}>
                          {item.number}
                        </TableCell>
                        <TableCell style={{ color: "white" }}>
                          {cityName || "-"}
                        </TableCell>
                        <TableCell style={{ color: "white" }}>
                          {dateTime || "-"}
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "purple", color: "white" }}
                        >
                          {temperature + " " + "°C" || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {filteredCities.length === 0 && <p>No matching cities found.</p>}

          <p className="footer" style={{ marginTop: 'auto', padding: 20,color: 'white' }}> copy right by @madina {new Date().getFullYear()}</p>
         
        </>
      )}
    </div>
  );
};

export default Weather;
