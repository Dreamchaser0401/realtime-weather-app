import { useState, useCallback, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import WeatherCard from "./views/WeatherCard";
import { getMoment, findLocation } from "./utils/helpers";
import useWeatherAPI from "./hooks/useWeatherAPI";
import WeatherSetting from "./views/WeatherSetting";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = "CWB-E8DC762C-B1B2-463E-B74A-B130A692DEEE";

const App = () => {
  // 從localStorage取得先前保存地區，若沒有則給預設台中市
  const storageCity = localStorage.getItem("cityName") || "臺中市";
  const [currentCity, setCurrentCity] = useState(storageCity);
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
  const [currentTheme, setCurrentTheme] = useState("light");

  // TODO: 等使用者可以修改地區時要修改裡面的參數
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* 決定要呈現哪個元件 */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
