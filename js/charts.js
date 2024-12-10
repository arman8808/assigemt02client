export function renderBarChart(ctx, data, onClick) {
  const features = ["A", "B", "C", "D", "E", "F"];
  const values = features.map((feature) =>
    data.reduce((acc, item) => acc + (item.features[feature] || 0), 0)
  );

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: features,
      datasets: [
        {
          label: "Total Time Spent",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(197, 90, 17, 1)",
          hoverBorderColor: "rgba(197, 90, 17, 1)",
          cursor: "pointer"
          
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      onClick: (event, elements) => {
        if (elements.length > 0 && onClick) {
          const index = elements[0].index;
          const feature = features[index];
          onClick(feature);
        }
      },
    },
  });
}

export function renderLineChart(ctx, data, feature) {
  const dates = data.map((item) => item.date);
  const values = data.map((item) => item.features[feature] || 0);

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Time Trend for Feature ${feature}`,
          data: values,
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        zoom: {
          zoom: {
            enabled: true,
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
          },
        },
      },
    },
  });
}

