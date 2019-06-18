import * as React from 'react';
import RollingItem from './rolling-item';

// import imageFile from './images/spr_machine_rolling.png';
import imageFile from './images/french-fries.png';

interface IContainerProps {

}

interface IContainerState {
  start: boolean;
}
export default class Container extends React.PureComponent<IContainerProps, IContainerState> {

  constructor(props: IContainerProps, context?: any) {
    super(props, context);

    this.state = {
      start: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  public render(): React.ReactNode {

    return (
      <>
        <RollingItem
          on={this.state.start}
          row={3}
          backgroundImage={imageFile}
          backgroundSize="1280px 640px"
          itemInfo={
            [
              { x: 0, y: -63, id: 'item_0' },
              { x: -267, y: -63, id: 'item_1' },
              { x: -536, y: -63, id: 'item_2' },
              { x: -803, y: -63, id: 'item_3' },
              { x: -1070, y: -63, id: 'item_4' },
              { x: 0, y: -365, id: 'item_5' },
              { x: -267, y: -365, id: 'item_6' },
              { x: -536, y: -365, id: 'item_7' },
              { x: -803, y: -365, id: 'item_8' },
              { x: -1070, y: -365, id: 'item_9' }
            ]
          }
          width={210}
          height={210}
          completionAnimation={true}
          onProgress={(isProgress, result) => { console.log(result); }}
        />
        <button className="start_btn" onClick={this.onClick}>{!this.state.start ? 'START' : 'STOP'}</button>
      </>
    );
  }

  public onClick = (e: any) => {
    this.setState({ start: !this.state.start }, () => {
      setTimeout(() => {
        this.setState({ start: !this.state.start });
      }, 1500);
    });
  }
}