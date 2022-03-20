var data = [
      { y: '2014', a: 2, b: 2},
      { y: '2015', a: 5,  b: 4},
      { y: '2016', a: 8,  b: 9},
      { y: '2017', a: 15,  b: 10},
      { y: '2018', a: 20,  b: 25},
      { y: '2019', a: 10,  b: 10},
      { y: '2020', a: 12, b: 11},
      { y: '2021', a: 15, b: 16},
      { y: '2022', a: 20, b: 15},
      { y: '2023', a: 5, b: 5},
      { y: '2024', a: 10, b: 10}
    ],
    config = {
      data: data,
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Total Project Income', 'Total Projects Finished'],
      fillOpacity: 0.6,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors:['#ffffff'],
      pointStrokeColors: ['black'],
      lineColors:['gray','red']
  };
config.element = 'area-chart';
Morris.Area(config);
config.element = 'line-chart';
Morris.Line(config);
