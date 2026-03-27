import { Bar } from '@antv/g2plot';

const data = [
    { year: 'yearSomething', value: 38 },
    { year: 'yearSomething', value: 52 },
    { year: 'yearSomething', value: 61 },
    { year: 'yearSomething', value: 145 },
    { year: 'yearSomething', value: 48 },
];

const bar = new Bar('container', {
    data,
    xField: 'value',
    yField: 'year',
    seriesField: 'year',
    legend: {
        position: 'top-left',
    },
    coordinate: [{ type: 'reflectX' }, { type: 'reflectY' }],
});

bar.render();
