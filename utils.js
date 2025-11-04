const getBoundsForPoints = (points) => {
  // Calculate corner values of bounds
  const pointsLong = points
    .filter((point) => point.geometry.coordinates != null)
    .map((point) => point.geometry.coordinates[0]);
  const pointsLat = points
    .filter((point) => point.geometry.coordinates != null)
    .map((point) => point.geometry.coordinates[1]);

  if (pointsLong.length === 0 || pointsLat.length === 0) {
    return null;
  } else {
    const cornersLongLat = [
      [Math.min(...pointsLong), Math.min(...pointsLat)],
      [Math.max(...pointsLong), Math.max(...pointsLat)],
    ];
    return cornersLongLat;
  }
};
