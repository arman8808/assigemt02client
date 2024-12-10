import { fetchData } from "./utils.js";
// import { dataset } from "./data.js";
import { filterData } from "./filter.js";
import { renderBarChart, renderLineChart } from "./charts.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ctxBar = document.getElementById("bar-chart").getContext("2d");
  const ctxLine = document.getElementById("line-chart").getContext("2d");
  let filters = getFiltersFromURL();
  console.log(filters, "filters from URL");

  if (
    filters.age !== "all" ||
    filters.gender !== "all" ||
    filters.startDate ||
    filters.endDate
  ) {
    saveFiltersToCookies(filters);
  }

  if (
    !filters.age ||
    !filters.gender ||
    !filters.startDate ||
    !filters.endDate
  ) {
    filters = getFiltersFromCookies();
    console.log(filters, "filters from cookies");
  }
  document.getElementById("age").value = filters.age;
  document.getElementById("gender").value = filters.gender;
  document.getElementById("start-date").value = filters.startDate;
  document.getElementById("end-date").value = filters.endDate;
  const data = await fetchData();
  console.log(data, "data");

  let filteredData = filterData(data, filters);
  let barChart, lineChart;

  const updateBarChart = () => {
    if (barChart) barChart.destroy();
    barChart = renderBarChart(ctxBar, filteredData, (feature) => {
      updateLineChart(feature);
    });
  };

  const updateLineChart = (feature) => {
    if (lineChart) lineChart.destroy();
    lineChart = renderLineChart(ctxLine, filteredData, feature);
  };

  updateBarChart();

  document
    .getElementById("apply-filters")
    .addEventListener("click", async () => {
      filters.age = document.getElementById("age").value;
      filters.gender = document.getElementById("gender").value;
      filters.startDate = document.getElementById("start-date").value;
      filters.endDate = document.getElementById("end-date").value;
      console.log(filters, "filters");
      saveFiltersToCookies(filters);
      const data = await fetchData(filters);

      filteredData = filterData(data, filters);
      updateBarChart();
    });
  document
    .getElementById("resetFilters")
    .addEventListener("click", async () => {
      document.getElementById("age").value = "all";
      document.getElementById("gender").value = "all";
      document.getElementById("start-date").value = ""; 
      document.getElementById("end-date").value = "";

      filters.age = document.getElementById("age").value;
      filters.gender = document.getElementById("gender").value;
      filters.startDate = document.getElementById("start-date").value;
      filters.endDate = document.getElementById("end-date").value;
      console.log(filters, "filters");

      clearFiltersFromCookies();

      alert("Filters and cookies reset!");
      const data = await fetchData(filters);

      filteredData = filterData(data, filters);
      updateBarChart();
    });

  document.getElementById("share-button").addEventListener("click", () => {
    const shareableURL = generateShareableURL(filters);
    navigator.clipboard.writeText(shareableURL).then(() => {
      alert("Shareable URL copied to clipboard!");
    });
  });
});

function generateShareableURL(filters) {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams(filters);
  return `${baseUrl}?${params.toString()}`;
}

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    age: params.get("age") || "all",
    gender: params.get("gender") || "all",
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
  };
}

function saveFiltersToCookies(filters) {
  const filtersString = JSON.stringify(filters);
  document.cookie = `filters=${encodeURIComponent(
    filtersString
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
}
function clearFiltersFromCookies() {
  document.cookie = "filters=; path=/; max-age=0";
}
function getFiltersFromCookies() {
  const cookies = document.cookie.split("; ");
  let filters = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key === "filters") {
      try {
        filters = JSON.parse(decodeURIComponent(value));
      } catch (error) {
        console.error("Error parsing filters from cookies:", error);
      }
    }
  });

  filters.age = filters.age || "all";
  filters.gender = filters.gender || "all";
  filters.startDate = filters.startDate || "";
  filters.endDate = filters.endDate || "";

  return filters;
}
