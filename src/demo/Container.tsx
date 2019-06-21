import * as React from 'react';
import RollingItem from '../lib';

// import imageFile from './images/spr_machine_rolling.png';
import imageFile from '../images/bg-fruit.png';

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
          // backgroundSize="1280px 640px"
          backgroundSize="600px 564px"
          itemInfo={
            [
              { x: -39, y: -28, id: 'item_0' },
              { x: -39, y: -217, id: 'item_1' },
              { x: -39, y: -406, id: 'item_2' },
              { x: -241, y: -28, id: 'item_3' },
              { x: -241, y: -217, id: 'item_4' },
              { x: -241, y: -406, id: 'item_5' },
              { x: -437, y: -28, id: 'item_6' },
              { x: -437, y: -217, id: 'item_7' },
              { x: -437, y: -406, id: 'item_8' },
            ]
            // [
            //   { x: 0, y: 0, id: 'item_0' },
            //   { x: -150, y: 0, id: 'item_1' },
            //   { x: -300, y: 0, id: 'item_2' },
            //   { x: 0, y: -190, id: 'item_7' },
            //   { x: -150, y: -190, id: 'item_8' },
            //   { x: -300, y: -190, id: 'item_9' }
            // ]
          }
          // width={210}
          // height={210}
          width={177}
          height={181}
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