import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function HoldingsBarChart({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p>📊 No holdings data available for chart</p>
      </div>
    );
  }

  // Prepare data for the bar chart
  const labels = holdings.map(stock => stock.name);
  const currentValues = holdings.map(stock => stock.price * stock.qty);
  const investedValues = holdings.map(stock => stock.avg * stock.qty);
  const profitLoss = holdings.map(stock => (stock.price * stock.qty) - (stock.avg * stock.qty));

  const data = {
    labels,
    datasets: [
      {
        label: 'Current Value',
        data: currentValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Invested Value',
        data: investedValues,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'P&L',
        data: profitLoss,
        backgroundColor: profitLoss.map(value => 
          value >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
        borderColor: profitLoss.map(value => 
          value >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Holdings Performance Overview',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ₹${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 10
          }
        },
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div style={{ 
      height: '400px', 
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      <Bar data={data} options={options} />
    </div>
  );
}

// Alternative simpler version with just current values
export function SimpleHoldingsBarChart({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p>📊 No holdings data available for chart</p>
      </div>
    );
  }

  // Sort holdings by current value (descending)
  const sortedHoldings = [...holdings].sort((a, b) => (b.price * b.qty) - (a.price * a.qty));
  
  const labels = sortedHoldings.map(stock => stock.name);
  const currentValues = sortedHoldings.map(stock => stock.price * stock.qty);

  const data = {
    labels,
    datasets: [
      {
        label: 'Current Value (₹)',
        data: currentValues,
        backgroundColor: currentValues.map((_, index) => {
          const hue = (index * 360 / currentValues.length) % 360;
          return `hsla(${hue}, 70%, 60%, 0.8)`;
        }),
        borderColor: currentValues.map((_, index) => {
          const hue = (index * 360 / currentValues.length) % 360;
          return `hsla(${hue}, 70%, 50%, 1)`;
        }),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Holdings by Current Value',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const stock = sortedHoldings[context.dataIndex];
            return [
              `Current Value: ₹${context.parsed.y.toFixed(2)}`,
              `Quantity: ${stock.qty}`,
              `Price: ₹${stock.price.toFixed(2)}`,
              `Avg Cost: ₹${stock.avg.toFixed(2)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ 
      height: '350px', 
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      <Bar data={data} options={options} />
    </div>
  );
}
