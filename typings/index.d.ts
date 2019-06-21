import * as React from 'react';
declare module 'react-rolling-item' {
  type ItemInfo = {x: string | number, y: string | number, id?: any, intro?: boolean};

  interface RollingItemProps extends Props<RollingItem> {
    on: boolean;
    row: number;
    backgroundImage: string;
    backgroundSize: string;
    itemInfo: ItemInfo[];
    width: number;
    height: number;
    completionAnimation?: boolean;
    onProgress?: (progress: boolean, result?: any[]) => void;
  }
  export default class RollingItem extends React.PureComponent<RollingItemProps, {}> {}
}