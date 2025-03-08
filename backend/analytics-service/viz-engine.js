// analytics-service/viz-engine.js
const { ChartJS } = require('chart.js');

class PerformanceVisualizer {
  generateSessionRadarChart(metrics) {
    return new ChartJS.radar({
      data: {
        labels: ['Accuracy', 'Tone', 'Speed', 'Terminology', 'Compliance'],
        datasets: [{
          data: [
            metrics.accuracy,
            metrics.toneScore,
            metrics.speedScore,
            metrics.jargonScore,
            metrics.complianceScore
          ],
          backgroundColor: 'rgba(255, 165, 0, 0.2)'
        }]
      },
      options: {
        scale: { ticks: { beginAtZero: true, max: 100 } }
      }
    });
  }

  generateHistoricalTrendChart(sessionHistory) {
    return new ChartJS.line({
      data: {
        labels: sessionHistory.map(s => s.date),
        datasets: [{
          label: 'Performance Trend',
          data: sessionHistory.map(s => s.overallScore),
          borderColor: '#FFA500'
        }]
      }
    });
  }
}