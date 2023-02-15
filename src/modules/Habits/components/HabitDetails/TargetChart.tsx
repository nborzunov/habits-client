import { Box, useTheme } from '@chakra-ui/react';
import { ArcElement, Chart, Legend, Title, Tooltip } from 'chart.js';
import { memo, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip, Legend, Title);

export const TargetChart = memo(({ completed, failed }: { completed: number; failed: number }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const data = useMemo(
        () => ({
            labels: [t('habits:completedTargets.short'), t('habits:failedTargets.short')],
            datasets: [
                {
                    data: [completed, failed],
                    backgroundColor: [theme.colors.green[400], theme.colors.yellow[400]],
                    hoverBackgroundColor: [theme.colors.green[500], theme.colors.yellow[500]],
                },
            ],
        }),
        [completed, failed, t, theme],
    );

    const options = useMemo(
        () => ({
            animation: false,
            plugins: {
                title: {
                    display: true,
                    text: t('habits:completedTargets.title'),
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

                            return `${
                                context.dataIndex === 0
                                    ? t('habits:completedCount', { count: context.parsed })
                                    : t('habits:failedCount', { count: context.parsed })
                            } - ${Math.round((context.parsed / allTargets) * 100)}%`;
                        },
                    },
                },
            },
        }),
        [t],
    );

    return (
        <Box>
            <Doughnut data={data} options={options as any} />
        </Box>
    );
});

TargetChart.displayName = 'TargetChart';
