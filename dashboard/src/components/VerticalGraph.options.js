export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        position: "top",
        labels: {
            font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
            color: "#333",
        },
        },
        title: {
            display: false,
        },
        tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#ddd",
            borderWidth: 1,
            cornerRadius: 4,
            callbacks: {
                label: function (context) {
                    const label = context.dataset.label || "";
                    const value = context.parsed.y;
                    return `${label}: ₹${value.toLocaleString()}`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 11,
                },
                color: "#666",
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: "rgba(0, 0, 0, 0.1)",
                drawBorder: false,
            },
            ticks: {
                font: {
                size: 11,
                },
                color: "#666",
                callback: function (value) {
                return "₹" + value.toLocaleString();
                },
            },
        },
    },
    elements: {
        bar: {
            borderRadius: 2,
            borderSkipped: false,
        },
    },
    interaction: {
        intersect: false,
        mode: "index",
    },
};
