import * as React from 'react';
import RollingItem from '../lib';

import imageFile from '../images/bg-fruit.png';

interface IContainerProps {

}

interface IContainerState {
  start: boolean;
  reset: boolean;
}
export default class Container extends React.PureComponent<IContainerProps, IContainerState> {

  constructor(props: IContainerProps, context?: any) {
    super(props, context);

    this.state = {
      start: false,
      reset: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onClickReset = this.onClickReset.bind(this);
  }

  public render(): React.ReactNode {

    return (
      <>
        <RollingItem
          on={this.state.start}
          row={3}
          backgroundImage={imageFile}
          backgroundSize="600px 564px"
          introItemInfo={{ x: -39, y: -28 }}
          itemInfo={
            [
              { x: -39, y: -217, id: 'item_1', probability: 20 },
              { x: -39, y: -406, id: 'item_2', probability: 5 },
              { x: -241, y: -28, id: 'item_3', probability: 10 },
              { x: -241, y: -217, id: 'item_4', probability: 20 },
              { x: -241, y: -406, id: 'item_5', probability: 15 },
              { x: -437, y: -28, id: 'item_6', probability: 50 },
              { x: -437, y: -217, id: 'item_7' },
              { x: -437, y: -406, id: 'item_8' },
            ]
          }
          width={177}
          height={181}
          startDelay={1000}
          reset={this.state.reset}
          completionAnimation={true}
          onProgress={(isProgress, result) => { console.log(result); }}
        />
        <button className="start_btn" onClick={this.onClick}>{!this.state.start ? 'START' : 'STOP'}</button>
        <button className="reset_btn" onClick={this.onClickReset}>RESET</button>
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

  public onClickReset = (e: any) => {
    this.setState({ reset: true }, () => {
      this.setState({ reset: false });
    });
  }
}