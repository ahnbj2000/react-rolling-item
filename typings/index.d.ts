import * as React from 'react';
declare module 'react-rolling-item' {
  type IntroItemInfo = {x: string | number, y: string | number};
  interface ItemInfo extends IntroItemInfo {id?: any, probability?: number}

  interface RollingItemProps {
    on: boolean;
    row: number;
    backgroundImage: string;
    backgroundSize: string;
    itemInfo: ItemInfo[];
    introItemInfo: IntroItemInfo;
    width: number;
    height: number;
    startDelay?: number;
    reset?: boolean;
    completionAnimation?: boolean;
    onProgress?: (progress: boolean, result?: any[]) => void;
  }
  export default class RollingItem extends React.PureComponent<RollingItemProps, {}> {}
}