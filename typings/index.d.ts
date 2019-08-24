import * as React from 'react';
declare module 'react-rolling-item' {
  type IntroItemInfo = {x: string | number, y: string | number};
  type ItemInfo = {x: string | number, y: string | number, id?: any, probability?: number};

  interface RollingItemProps {
    on: boolean;
    column: number;
    backgroundImage: string;
    backgroundSize: string;
    itemInfo: ItemInfo[];
    introItemInfo: IntroItemInfo;
    width: number;
    height: number;
    startDelay?: number;
    reset?: boolean;
    completionAnimation?: boolean;
    rootClassName?: string;
    onProgress?: (progress: boolean, result?: any[]) => void;
  }
  export default class RollingItem extends React.PureComponent<RollingItemProps, {}> {}
}