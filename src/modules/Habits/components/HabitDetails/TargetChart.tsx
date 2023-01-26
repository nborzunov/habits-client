import { useTheme } from '@chakra-ui/react';
import { ArcElement, Chart, Legend, Title, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend, Title);

export const TargetChart = ({ completed, failed }: { completed: number; failed: number }) => {
    const theme = useTheme();
    const data = {
        labels: ['Completed', 'Failed'],
        datasets: [
            {
                data: [completed, failed],
                backgroundColor: [theme.colors.green[400], theme.colors.yellow[400]],
                hoverBackgroundColor: [theme.colors.green[500], theme.colors.yellow[500]],
            },
        ],
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Overall Progress',
            },
            legend: {
                display: true,
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const allTargets = context.dataset.data.reduce(
                            (acc: number, cur: number) => acc + cur,
                            0,
                        );

                        const noun = context.parsed === 1 ? 'target' : 'targets';
                        return `${context.parsed} ${noun} - ${Math.round(
                            (context.parsed / allTargets) * 100,
                        )}%`;
                    },
                },
            },
        },
    };

    return <Doughnut data={data} options={options as any} />;
};
