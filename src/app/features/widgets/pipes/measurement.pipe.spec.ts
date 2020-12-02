import { MeasurementPipe } from './measurement.pipe';

describe('MeasurementPipe', () => {
  const testValues = [
    {
      value: 1,
      starttime: '2020-12-01T18:43:59.780000Z'
    },
    {
      value: 3,
      starttime: '2020-12-02T18:43:59.780000Z'
    },
    {
      value: 2,
      starttime: '2020-12-03T18:43:59.780000Z'
    },
  ];

  it('create an instance', () => {
    const pipe = new MeasurementPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the average of the values', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 1)).toEqual(2);
  });

  it('should return the most recent value', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 13)).toEqual(2);
  });

  it('should return the minimum value', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 3)).toEqual(1);
  });

  it('should return the maximum value', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 4)).toEqual(3);
  });

  it('should return the count of the values', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 5)).toEqual(3);
  });


  it('should return the median of the values', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 2)).toEqual(2);
  });

  it('should return the most recent value if unknown', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, 0)).toEqual(2);
  });

  it('should return null if no values', () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform([], 0)).toBeNull();
  });

});
