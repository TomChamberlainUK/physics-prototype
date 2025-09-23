export type CircleShape = {
  type: 'circle';
  radius: number;
};

export type BoxShape = {
  type: 'box';
  width: number;
  height: number;
};

export type Shape = CircleShape | BoxShape;